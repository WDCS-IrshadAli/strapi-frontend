"use server";

import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { z } from "zod";


// const BearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzEzNDE4MzI0LCJleHAiOjE3MTYwMTAzMjR9.D9NdgUn54iGX551w6r9uGBiulVFrs0N2OlfG8906Xao";
const AppUrl = process.env.APP_URL;
const AdminBearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEzNDE1NjE2LCJleHAiOjE3MTYwMDc2MTZ9.AZxW9qYtJaprvVJBimhEyRs4A6yO5-Sg6MurI1iQZTY";

// menus api data
export const getAllMenusData = async (BearerToken: any) => {
    try {
        let sidebarMenuData = await fetch(`${AppUrl}/api/menus?nested&populate=*`, {
            headers: {
                "Authorization": `Bearer ${BearerToken}`,
            },
            cache: "no-store"
        });
        sidebarMenuData = await sidebarMenuData.json();
        return sidebarMenuData;
    } catch (err) {        
        throw new Error("Error came while fetching menus data");
    }
}

// custom modules get api data
export const getAllModulesData = async (routeParams: any, BearerToken: any) => {
    let errorMsg = "Error came while fetching modules data";
    try {
        let data: any = await fetch(`${AppUrl}/api/${routeParams}`, {
            headers: {
                "Authorization": `Bearer ${BearerToken}`,
            },
            cache: "no-cache"
        });
        data = await data.json();
        console.log("FOR PAGE NOT FOUND ERROR = ", data);
        if (data?.error?.name === "NotFoundError") {
            errorMsg = "404 Page Not Found";            
            throw new Error(errorMsg);
        }
        if (data?.error?.name === "ForbiddenError") {
            errorMsg = "You're not authorized to access this page";
            throw new Error(errorMsg);
        }
        data = data?.data?.map((item: any) => {
            const { attributes, ...rest } = item;
            const { createdAt, updatedAt, publishedAt, ...attributesWithoutTimestamps } = attributes;
            return { ...rest, attributes: attributesWithoutTimestamps };
        });
        return data;  
    } catch (err) {        
        throw new Error(errorMsg);
    }
};

// dynamic input field form data api
export const getDynamicForm = async (uri: any, BearerToken: any) => {
    try {
        let dynamicFieldsData = await fetch(`${AppUrl}/api/content-type-builder/content-types/api::${uri}.${uri}`, {
            headers: {
                "Authorization": `Bearer ${BearerToken}`,
            },
            cache: "no-store"
        });
        dynamicFieldsData = await dynamicFieldsData.json();
        console.log("ssssssssssss", dynamicFieldsData);
        
        return dynamicFieldsData;
    } catch (err) {
        throw new Error("Error came while fetching data");
    }
}

// dynamic form (create api)
export const createDynamicModuleData = async (moduleName: string, BearerToken: any, prevState: ProductFormStateTypeProps, formData: FormData) => {       
    
    try {
        const rawFormData = Object.fromEntries(formData.entries());                
        let dynamicFieldsData: any = await fetch(`${AppUrl}/api/${moduleName}`, {
            method:"POST",
            body: JSON.stringify(rawFormData),
            headers: {
                "Authorization": `Bearer ${BearerToken}`,
            },
        });        
        dynamicFieldsData = await dynamicFieldsData.json()
        console.log("RESPONSE = ", dynamicFieldsData);
        if (dynamicFieldsData.error) {
            return {
                error: `${dynamicFieldsData?.error?.details?.errors == undefined ? dynamicFieldsData?.error?.message : dynamicFieldsData?.error?.details?.errors[0]?.message}`,
                success: false
            }    
        }
        revalidatePath(`/admin/${moduleName}`);
        return {
            message: `${moduleName} added successfully`,
            success: true
        } 
    } catch (err: any) {
        return {
            error: `Internal Server Error (${err.message})`,
            success: false
        }
    }
}

// dynamic form (delete api)
export const deleteDynamicModuleData = async (delUserId: any, moduleName: any, BearerToken: any, prevState: ProductFormStateTypeProps, formData: FormData) => {    
    try {        
        let dynamicFieldsData: any = await fetch(`${AppUrl}/api/${moduleName}/${delUserId}`, {
            method :"DELETE",
            headers : {
                "Authorization": `Bearer ${BearerToken}`,
            },
        });
        dynamicFieldsData = await dynamicFieldsData.json()
        console.log("RESPONSE = ", dynamicFieldsData);
        if (dynamicFieldsData.error) {
            return {
                error: `${dynamicFieldsData?.error?.details?.errors == undefined ? dynamicFieldsData?.error?.message : dynamicFieldsData?.error?.details?.errors[0]?.message}`,
                success: false
            }    
        }
        revalidatePath(`/admin/${moduleName}`);
        return {
            message: `${moduleName} deleted successfully`,
            success: true
        }
    } catch (err: any) {
        return {
            error: `Internal Server Error (${err.message})`,
            success: false
        }
    }
}

// dynamic form (get particulat id data)
export const getPaticularDynamicModuleData = async (moduleName: any, params: any, BearerToken: any) => {
    try {
        let dynamicFieldsData = await fetch(`${AppUrl}/api/${moduleName}/${params.id}`, {
            headers: {
                "Authorization": `Bearer ${BearerToken}`,
            },
            cache: "no-store"
        });
        dynamicFieldsData = await dynamicFieldsData.json();
        return dynamicFieldsData;
    } catch (err) {
        throw new Error("Error came while fetching menus data");
    }
}

// dynamic form (create api)
export const updateDynamicModuleData = async (moduleName: string, userId: any, BearerToken: any, prevState: ProductFormStateTypeProps, formData: FormData) => {   
    try {
        const rawFormData = Object.fromEntries(formData.entries());                
        let dynamicFieldsData: any = await fetch(`${AppUrl}/api/${moduleName}/${userId}`, {
            method: "PUT",
            body: JSON.stringify(rawFormData),
            headers: {
                "Authorization": `Bearer ${BearerToken}`,
            },
        });        
        dynamicFieldsData = await dynamicFieldsData.json()
        console.log("RESPONSE = ", dynamicFieldsData);
        if (dynamicFieldsData.error) {
            return {
                error: `${dynamicFieldsData?.error?.details?.errors == undefined ? dynamicFieldsData?.error?.message : dynamicFieldsData?.error?.details?.errors[0]?.message}`,
                success: false
            }    
        }
        revalidatePath(`/admin/${moduleName}`);
        return {
            message: `${moduleName} updated successfully`,
            success: true
        } 
    } catch (err: any) {
        return {
            error: `Internal Server Error (${err.message})`,
            success: false
        }
    }
}

// custom routes (faq count)
export const customRouteFaqsCount = async (BearerToken: any) => {
    try {
        let faqsCount = await fetch(`${AppUrl}/api/faqs/count`, {
            headers: {
                "Authorization": `Bearer ${BearerToken}`,
            },
            cache: "no-store"
        });
        faqsCount = await faqsCount.json();
        return faqsCount;
    } catch (err) {
        throw new Error("Error came while fetching menus data");
    }
}

// menus api data
export const getContentManagerApi = async (moduleName: string) => {    
    try {
        let configureViewData = await fetch(`${AppUrl}/content-manager/content-types/api::${moduleName}.${moduleName}/configuration`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${AdminBearerToken}`,
            },
            cache: "no-store"
        });
        configureViewData = await configureViewData.json();

        const modifyResponse = (jsonResponse: any) => {
            const modifiedResponse: any = { ...jsonResponse };
        
            if (modifiedResponse.data && modifiedResponse.data.contentType) {
                const { metadatas, layouts } = modifiedResponse.data.contentType;
        
                const formattedMetadatas = formatData(layouts.edit, metadatas);
        
                modifiedResponse.data.contentType.metadatas = formattedMetadatas;
            }
        
            return modifiedResponse;
        }
        
        const getSize = (layouts: any, fieldName: any) => {
            for (const layout of layouts) {
                for (const field of layout) {
                    if (field.name === fieldName) {
                        return field.size;
                    }
                }
            }
            return null;
        }
        
        const formatData = (layouts: any, metadatas: any) => {
            const formattedMetadatas: any = {};
        
            // Iterate over each layout section
            for (const layout of layouts) {
                // Iterate over fields in the layout section
                for (const field of layout) {
                    const fieldName = field.name;
                    if (metadatas.hasOwnProperty(fieldName)) {
                        if (!formattedMetadatas[fieldName]) {
                            formattedMetadatas[fieldName] = { };
                            // formattedMetadatas[fieldName] = { edit: {}, list: {} };
                        }
                        // Assign metadata to the edit and list fields of the formattedMetadatas
                        formattedMetadatas[fieldName] = {
                            ...formattedMetadatas[fieldName].edit,
                            ...metadatas[fieldName].edit
                        };
                        // formattedMetadatas[fieldName].edit = {
                        //     ...formattedMetadatas[fieldName].edit,
                        //     ...metadatas[fieldName].edit
                        // };
                        // formattedMetadatas[fieldName].list = {
                        //     ...formattedMetadatas[fieldName].list,
                        //     ...metadatas[fieldName].list
                        // };
                        // Assign additional properties (name, size) from layout field
                        formattedMetadatas[fieldName].name = fieldName;
                        formattedMetadatas[fieldName].size = field.size;
                        // formattedMetadatas[fieldName].list.name = fieldName;
                    }
                }
            }
            return formattedMetadatas;
        }
        
        
        let modifiedResponse = modifyResponse(configureViewData);
        // modifiedResponse = JSON.stringify(modifiedResponse, null, 2);
        // console.log("xxxxxxxxxxxxxxxxxxxxxxxx", modifiedResponse);
        

        // console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", configureViewData);
        


        return modifiedResponse;
    } catch (err) {        
        throw new Error("Error came while fetching data");
    }
}

// authorize user (login)
export const loginUser = async (prevState: any, formData: FormData) => {
    const userSchema = z.object({
        username: z.string().trim().min(3),
        password: z.string(),
    });

    // validating data using zod schema
    const validateFields = userSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    })

    // check if errors
    if (!validateFields.success) {
        const errorShow: any = validateFields.error.flatten().fieldErrors;
        let key = Object.keys(errorShow)[0]!==undefined ? Object.keys(errorShow)[0] : "error";
        let value = errorShow[Object.keys(errorShow)[0]]!==undefined ? `(${key}) ${errorShow[Object.keys(errorShow)[0]][0]}` : `(${key}) Something went wrong, while validating login form.`;
        return {
            error: value,
            success: false
        }
    }
    try {
        await signIn("credentials", validateFields.data);
    } catch (error: any) {         
        console.log("LOG IN = ", error);
                   
        if (error instanceof AuthError) {
            switch (error.type) {
              case 'CredentialsSignin':
                return {
                    error: "Invalid credentials.",
                    success: false,
                }
              default:
                return {
                    error: "Something went wrong while validating user.",
                    success: false,
                }
            }
        }
        throw error;
    }
}



// export const getDynamicForm = async (uidx: any) => {
//     try {
//         let labelField = await fetch(`http://localhost:1337/content-manager/content-types/${uidx}/configuration`, {
//             headers: {
//                 "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzExMDg4NzcyLCJleHAiOjE3MTM2ODA3NzJ9.YaTeOI9TTO7OaeF-sXoJuGNA1BM79NXOt9DifSVgpog"
//             }
//         });
//         labelField = await labelField.json();

//         let inputValidation = await fetch(`http://localhost:1337/content-type-builder/content-types/${uidx}`, {
//             headers: {
//                 "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzExMDg4NzcyLCJleHAiOjE3MTM2ODA3NzJ9.YaTeOI9TTO7OaeF-sXoJuGNA1BM79NXOt9DifSVgpog"
//             }
//         });
//         inputValidation = await inputValidation.json();

//         console.log("kkkkkkkkkkkkkkk", uidx);
        
//         const labelAttributes = inputValidation.data.schema.attributes;
//         console.log("ccccccccccccc", labelAttributes);

//         const data = {
//             uid: inputValidation.data.uid,
//             apiID: inputValidation.data.apiID,
//             formFields: Object.keys(labelAttributes).map(key => {
//                 const attribute = labelAttributes[key];
//                 const metadata = labelField.data.contentType.metadatas[key];
            
//                 return {
//                     name: key,
//                     type: attribute.type,
//                     required: attribute.required || false,
//                     maxLength: attribute.maxLength || null,
//                     minLength: attribute.minLength || null,
//                     label: metadata.edit.label,
//                     description: metadata.edit.description || "",
//                     placeholder: metadata.edit.placeholder || "",
//                     visible: metadata.edit.visible || false,
//                     editable: metadata.edit.editable || false
//                 };
//             })
//         }

//         return data;    
//     } catch (err) {
//         throw new Error("Error came while fetching dynamic form data");
//     }
// }
