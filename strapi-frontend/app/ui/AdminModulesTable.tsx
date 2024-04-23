"use client"

import React from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { deleteDynamicModuleData } from "../lib/strapi";
import { useFormState } from "react-dom";
import Link from "next/link";
import { auth } from "@/auth";


export default function AdminModulesTable({ data, params, token }: { data: any, params: any, token: any }) {    
    const tableHeadingsArr = data?.length > 0 ? Object.keys(data[0]?.attributes) : [];
    
    // if no records
    if (tableHeadingsArr.length <= 0) {
        return (
            <Table>
                <TableCaption>No records found in {params} module.</TableCaption>
            </Table>
        )
    }     
                
  return (
    <>
        <Table>
            <Toaster position="top-right" theme="dark" richColors />
            <TableCaption>A list of your recent {params}.</TableCaption>

            <TableHeader>
                <TableRow>
                <TableHead>Id</TableHead>
                {
                    tableHeadingsArr?.map((curElem, index) => {
                        return (
                            <TableHead key={index}>{curElem}</TableHead>
                        )
                    })
                }
                </TableRow>
            </TableHeader>

            <TableBody>
                {data?.map((curElem: any, index: any) => {
                    return (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{index+=1}</TableCell>
                            {
                                tableHeadingsArr?.map((curElemxx, indexxx) => {
                                    return (
                                        <TableCell key={indexxx}>{`${curElem?.attributes[`${curElemxx}`]}`}</TableCell>
                                    )
                                })
                            }
                            <TableCell><Button variant="outline"><Link href={`/admin/${params}/edit/${curElem.id}`}><Pencil1Icon /></Link></Button></TableCell>
                            <TableCell>
                                <DeleteButtonComponent curElem={curElem} params={params} token={token} />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    </>
  )
}


export function DeleteButtonComponent ({ curElem, params, token }: any) {
    let delUserId: number = curElem.id;
    const deleteWithId = deleteDynamicModuleData.bind(null, delUserId, params, token);
    const initialState: any = { message: null, error: null, success: null };
    const [state, dispatch] = useFormState(deleteWithId, initialState);
                  
    // error & success msg handling
    if (state.success === false) {
        toast.error(state.error);
        state.success = null;
        state.error = null;
    } else if (state.success === true) {
        toast.success(state.message);
        state.success = null;
        state.message = null;
    }
    return (
        <>
            {/* <Toaster position="top-right" theme="dark" richColors /> */}
            <form action={dispatch}>
                <Button type="submit" variant="outline"><TrashIcon /></Button>
            </form>
        </>
    )
}