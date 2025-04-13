"use client";

import { Heading } from "@/components/heading";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { Category, SubCategory } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface SubcategoryFormProps {
  initialData: SubCategory | null;
}

// ✅ Removed "value" field from schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Please select a category"),
});

export const SubcategoryForm = ({ initialData }: SubcategoryFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      categoryId: "",
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const storeId = Array.isArray(params.storeId)
          ? params.storeId[0]
          : params.storeId;

        const querySnapshot = await getDocs(
          collection(db, "stores", storeId, "categories")
        );
        const categoryList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(categoryList);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [params.storeId]);

  const title = initialData ? "Edit Sub-Category" : "Create Sub-Category";
  const description = initialData
    ? "Edit an existing sub-category"
    : "Add a new sub-category";
  const toastMessage = initialData
    ? "Sub-Category Updated"
    : "Sub-Category Created";
  const action = initialData ? "Save Changes" : "Create Sub-Category";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/subcategory/${params.subcategoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/subcategory`, data);
      }

      toast.success(toastMessage);
      router.push(`/${params.storeId}/subcategory`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(
        `/api/${params.storeId}/subcategory/${params.subcategoryId}`
      );

      toast.success("Sub-Category Removed");
      router.refresh();
      router.push(`/${params.storeId}/subcategory`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-2 gap-8">
            {" "}
            {/* ✅ Adjusted grid columns after removing the value field */}
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Sub-Category name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Category Dropdown */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isLoading}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} type="submit" size={"sm"}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
