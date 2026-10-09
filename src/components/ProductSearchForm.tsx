"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, defaultQuery, SearchQuerySchema } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
    onSearch: (query: SearchQuery) => Promise<void>;
};



export default function ProductSearchForm(
    { onSearch }: ProductSearchFormProps
) {
    //const { register } = useForm<SearchQuery>({
    //defaultValues: defaultQuery,
    //});
    //const {
    //register,
    //formState: { errors },
//} = useForm<SearchQuery>({
    // เติม: ตัวเชื่อมที่ทำให้ React Hook Form ตรวจข้อมูลด้วย Zod Schema
    //resolver: zodResolver(SearchQuerySchema),
   // mode: "onTouched",
   // defaultValues: defaultQuery,
//});
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SearchQuery>({ /* ตัวเลือกเดิม */ });

    return (
        // เติม: เมธอดของ useForm ที่ห่อฟังก์ชันก่อนส่งให้ onSubmit
        <form className="search-form" onSubmit={handleSubmit(onSearch)} noValidate>
            <div className="field-group">
                <label htmlFor="q">คำค้น</label>
                <input className="form-input" id="q" {...register("q")} placeholder="phone" />
            </div>

            <div className="field-group">
                <label htmlFor="limit">จำนวนรายการ</label>
                <input
                    className="form-input"
                    id="limit"
                    type="number"
                    required
                    {...register("limit", { valueAsNumber: true })}
                    aria-invalid={!!errors.limit}
                    aria-describedby="limit-error"
                />
                <span id="limit-error" role="alert">{errors.limit?.message}</span>
            </div>

            <div className="field-group">
                <label htmlFor="sortBy">เรียงตาม</label>
                <select className="form-select" id="sortBy" {...register("sortBy")}>
                    {SORT_FIELDS.map((field) => (
                        <option key={field} value={field}>{field}</option>
                    ))}
                </select>
            </div>

            <div className="field-group action-box">
                <button className="search-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "กำลังค้นหา" : "ค้นหา"}
                </button>
            </div>
        </form>
    );

    }
