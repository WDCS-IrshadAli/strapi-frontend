"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from '@/components/ui/textarea'
import { createDynamicModuleData, updateDynamicModuleData } from '../lib/strapi'
import { useFormState } from 'react-dom'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { InfoCircledIcon } from '@radix-ui/react-icons'



const DynamicForm = ({ data, moduleName, particularData, userId, formType, configureViewData, token }: { data: any, moduleName: any, particularData: any, userId: any, formType: any, configureViewData: any, token: any }) => {
      const router  = useRouter();
      const contentManagerData = configureViewData?.data?.contentType?.metadatas;
      const dynamicFieldsData = data?.data?.schema?.attributes;
      
      // dynamic form elements handling
      const formElements = Object.keys(contentManagerData).map(
        (fieldName, index) => {                      
          const fieldData = {
            ...dynamicFieldsData[fieldName],
            ...contentManagerData[fieldName]
          };          
          let inputElement = null;   
                           
          switch (fieldData.type) {
            case "string":
            case "email":
            case "password":
              inputElement = (
                <Input
                    className="placeholder:font-normal font-normal"
                    type={
                      fieldData.type === "password"
                        ? "password"
                        : fieldData.type === "email"
                        ? "email"
                        : "text"
                    }
                    name={fieldName}
                    placeholder={fieldData?.placeholder ? fieldData?.placeholder : fieldName.charAt(0).toUpperCase()+fieldName.slice(1) || ""}
                    required={fieldData.required}
                    minLength={fieldData.minLength}
                    maxLength={fieldData.maxLength}          
                    defaultValue={formType==="addForm" ? 
                    (fieldData.default || "") : (
                      particularData && fieldName in particularData.data.attributes
                          ? particularData.data.attributes[fieldName]
                          : ""
                    )}
                    id={fieldName}
                    disabled={formType=="editForm" && !fieldData.editable}
                    // onChange={handleChange}
                  />
                  
              );
              break;

            case "enumeration":
              inputElement = (
                  <Select name={fieldName} disabled={formType=="editForm" && !fieldData.editable} defaultValue={formType==="addForm" ? 
                    (fieldData.default || "") : (
                      particularData && fieldName in particularData.data.attributes
                          ? particularData.data.attributes[fieldName]
                          : ""
                    )}>
                    <SelectTrigger id={fieldName} name={fieldName} className="w-full">
                      <SelectValue 
                      placeholder={fieldData?.placeholder ? `${fieldData?.placeholder}` : `Select ${fieldName}`} />
                    </SelectTrigger>
                  
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{`Select ${fieldName}`}</SelectLabel>
                          {fieldData.enum.map((option: any, index: any) => (
                            <SelectItem key={index} value={option}>{option}</SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
              );
              break;

            case "boolean":
              inputElement = (
                  <RadioGroup id={fieldName} name={fieldName} disabled={formType=="editForm" && !fieldData.editable} required={fieldData.required}
                  defaultValue={formType==="addForm" ? 
                  (fieldData.default ? `${fieldData.default}` : "null") : (
                    particularData && fieldName in particularData.data.attributes
                      ? `${particularData.data.attributes[fieldName]}`
                      : "null"
                  )}>
                    {/* <div className="flex items-center space-x-2">
                      <RadioGroupItem value={"null"} id="r1" />
                      <Label htmlFor="r1">Null</Label>
                    </div> */}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={"true"} id="r2" />
                      <Label htmlFor="r2">True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={"false"} id="r3" />
                      <Label htmlFor="r3">False</Label>
                    </div>
                  </RadioGroup>
              );
              break;

            case "decimal":
            case "integer":
            case "big integer":
            case "float":
              inputElement = (
                  <Input
                    className="placeholder:font-normal font-normal"
                    type="number"
                    placeholder={fieldData?.placeholder ? fieldData?.placeholder : fieldName.charAt(0).toUpperCase()+fieldName.slice(1) || ""}
                    name={fieldName}
                    required={fieldData.required}
                    defaultValue={formType==="addForm" ? 
                    (fieldData.default || "") : (
                      particularData && fieldName in particularData.data.attributes
                          ? particularData.data.attributes[fieldName]
                          : ""
                    )}
                    id={fieldName}
                    disabled={formType=="editForm" && !fieldData.editable}
                    //   onChange={handleChange}
                  />
              );
              break;

            case "date":
            case "datetime":
              inputElement = (
                  <Input
                    className="placeholder:font-normal font-normal"
                    type="date"
                    name={fieldName}
                    required={fieldData.required}
                    defaultValue={formType==="addForm" ? 
                    (fieldData.default || "") : (
                      particularData && fieldName in particularData.data.attributes
                          ? particularData.data.attributes[fieldName]
                          : ""
                    )}
                    id={fieldName}
                    disabled={formType=="editForm" && !fieldData.editable}
                    //   onChange={handleChange}
                  />
              );
              break;

            case "text":
            case "richtext":
              inputElement = (
                  <Textarea
                    className="placeholder:font-normal font-normal"
                    placeholder={fieldData?.placeholder ? fieldData?.placeholder : fieldName.charAt(0).toUpperCase()+fieldName.slice(1) || ""}
                    required={fieldData.required}
                    name={fieldName}
                    minLength={fieldData.minLength}
                    maxLength={fieldData.maxLength}
                    defaultValue={formType==="addForm" ? 
                    (fieldData.default || "") : (
                      particularData && fieldName in particularData.data.attributes
                          ? particularData.data.attributes[fieldName]
                          : ""
                    )}
                    id={fieldName}
                    rows={5}
                    disabled={formType=="editForm" && !fieldData.editable}
                    //  onChange={handleChange}
                  />
              );
              break;

            case "media":
              inputElement = (
                <div key={index} className="grid grid-cols-1 w-full max-w-sm items-center gap-2">
                  <Input
                    type="file"
                    id={fieldName}
                    accept={fieldData.allowedTypes.join(",")}
                    multiple={fieldData.multiple}
                    name={fieldName}
                    required={fieldData.required}
                    disabled={formType=="editForm" && !fieldData.editable}
                    // onChange={handleFileChange}
                  />
                  </div>
              );
              break;

            default:
              inputElement = null;
          }

          let gridSize;
          if (fieldData.size==4) {
            gridSize = "lg:col-span-3 md:col-span-6 col-span-12"
          } else if (fieldData.size==6) {
            gridSize = "sm:col-span-6 col-span-12"
          } else if (fieldData.size==8) {
            gridSize = "sm:col-span-8 col-span-12"
          } else {
            gridSize = "sm:col-span-12 col-span-12"
          }

          let gridCss = `px-2 mb-2 ${gridSize}`;
          console.log(fieldData.name, fieldData.type, fieldData.size);
          console.log(gridCss);
          
    
          return (
            fieldData.type !== "relation" && (
              <div className={gridCss}>
                    <div key={index} className={`w-full flex flex-col gap-1`}>
                      {/* LABEL FIELD */}
                      <Label htmlFor={fieldName} className="text-xs text-gray-500">{fieldData?.label ? fieldData?.label : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</Label>
                      {/* INPUT FIELD */}
                      {inputElement}
                      {/* DESCRIPTION FIELD */}
                      {
                        fieldData?.description ?
                        <p className="text-xs italic font-normal text-gray-500 flex">
                          <InfoCircledIcon className="mr-1" />{fieldData?.description}
                        </p>
                        : ""
                      }
                    </div>
                </div>
            ));
        }
      );

      // form submit handling functions
      const initialState: ProductFormStateTypeProps = { message: null, error: null, success: null };
      const submitDataWithBinding = formType==="addForm" ? (
          moduleName===null ? "" : createDynamicModuleData.bind(null, moduleName, token)
        ) : (
          moduleName===null ? "" : updateDynamicModuleData.bind(null, moduleName, userId, token)
        );
      const serverAction: any = submitDataWithBinding;  
      const [state, dispatch] = useFormState(serverAction, initialState);

      // error handling 
      if (state.success === false) {
        toast.error(state.error);
        state.success = null;
        state.error = null;
      } else if (state.success === true) {
        toast.success(state.message);
        state.success = null;
        state.message = null;
        setTimeout(() => {
          router.push(`/admin/${moduleName}`)
        }, 1000)
      }
    
      return (
        <>
          <div className="py-3 sm:py-6 pb-10 relative">
              <Toaster position="top-right" theme="dark" richColors />
              <h1 className="text-2xl px-3 sm:px-6 mb-4">{formType==="addForm" ? "Add" : "Update"} {moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}</h1>
              
              <div className="overflow-x-auto overflow-y-auto w-full h-[75vh] px-3 sm:px-6">
              
                {/* FORM  */}
                <form action={dispatch} className="flex flex-col">
                  <div className="grid grid-cols-4">
                  {formElements.map((curElem, index) => (
                    <React.Fragment key={index}>
                      {curElem}
                    </React.Fragment>
                  ))}
                  </div>

                  <div className="grid w-full items-center gap-2 mt-3">
                    <Button type="submit">Submit</Button>
                  </div>        
                </form>

              </div>
          </div>
        </>
      );
}

export default DynamicForm















// LATEST ONE --------------------------------------------------------------------------------------------------------

// const DynamicForm = ({ data, moduleName, particularData, userId, formType, configureViewData }: { data: any, moduleName: any, particularData: any, userId: any, formType: any, configureViewData: any }) => {
//   const router  = useRouter();

//   console.log("zzzzzzzzzzzzzzzzzzzz", configureViewData?.data?.contentType?.metadatas);
  
  
//   // dynamic form elements handling
//   const formElements = Object.keys(data?.data?.schema?.attributes).map(
//     (fieldName, index) => {            
//       const fieldData = data.data.schema.attributes[fieldName];
//       let inputElement = null;          

//       console.log("ccheeeeeeeeeeeeeeeeeeeeeeeeeeeee", data?.data);
      

//       switch (fieldData.type) {
//         case "string":
//         case "email":
//         case "password":
//           inputElement = (
//             <div key={index} className="grid grid-cols-1 w-full max-w-sm items-center gap-2">
//               <Input
//                 className="placeholder:font-normal font-normal"
//                 type={
//                   fieldData.type === "password"
//                     ? "password"
//                     : fieldData.type === "email"
//                     ? "email"
//                     : "text"
//                 }
//                 name={fieldName}
//                 placeholder={fieldName.charAt(0).toUpperCase()+fieldName.slice(1) || ""}
//                 required={fieldData.required}
//                 minLength={fieldData.minLength}
//                 maxLength={fieldData.maxLength}          
//                 defaultValue={formType==="addForm" ? 
//                 (fieldData.default || "") : (
//                   particularData && fieldName in particularData.data.attributes
//                       ? particularData.data.attributes[fieldName]
//                       : ""
//                 )}
//                 id={fieldName}
//                 // onChange={handleChange}
//               />
//             </div>
//           );
//           break;

//         case "enumeration":
//           inputElement = (
//             <div key={index} className="grid grid-cols-1 w-full max-w-sm items-center gap-2">
//               <Select name={fieldName} defaultValue={formType==="addForm" ? 
//                 (fieldData.default || "") : (
//                   particularData && fieldName in particularData.data.attributes
//                       ? particularData.data.attributes[fieldName]
//                       : ""
//                 )}>
//                 <SelectTrigger id={fieldName} name={fieldName} className="w-full">
//                   <SelectValue placeholder={`Select ${fieldName}`} />
//                 </SelectTrigger>
              
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>{`Select ${fieldName}`}</SelectLabel>
//                       {fieldData.enum.map((option: any, index: any) => (
//                         <SelectItem key={index} value={option}>{option}</SelectItem>
//                       ))}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//           );
//           break;

//         case "boolean":
//           inputElement = (
//             <div key={index} className="grid grid-cols-1 w-full max-w-sm items-center gap-2">
//               <RadioGroup id={fieldName} name={fieldName} required={fieldData.required}
//               defaultValue={formType==="addForm" ? 
//               (fieldData.default ? `${fieldData.default}` : "null") : (
//                 particularData && fieldName in particularData.data.attributes
//                   ? `${particularData.data.attributes[fieldName]}`
//                   : "null"
//               )}>
//                 {/* <div className="flex items-center space-x-2">
//                   <RadioGroupItem value={"null"} id="r1" />
//                   <Label htmlFor="r1">Null</Label>
//                 </div> */}
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value={"true"} id="r2" />
//                   <Label htmlFor="r2">True</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value={"false"} id="r3" />
//                   <Label htmlFor="r3">False</Label>
//                 </div>
//               </RadioGroup>
//             </div>
//           );
//           break;

//         case "decimal":
//         case "integer":
//         case "big integer":
//         case "float":
//           inputElement = (
//             <div key={index} className="grid grid-cols-1 w-full max-w-sm items-center gap-2">
//               <Input
//                 className="placeholder:font-normal font-normal"
//                 type="number"
//                 placeholder={fieldName}
//                 name={fieldName}
//                 required={fieldData.required}
//                 defaultValue={formType==="addForm" ? 
//                 (fieldData.default || "") : (
//                   particularData && fieldName in particularData.data.attributes
//                       ? particularData.data.attributes[fieldName]
//                       : ""
//                 )}
//                 id={fieldName}
//                 //   onChange={handleChange}
//               />
//             </div>
//           );
//           break;

//         case "date":
//         case "datetime":
//           inputElement = (
//             <div key={index} className="grid grid-cols-1 w-full max-w-sm items-center gap-2">
//               <Input
//                 className="placeholder:font-normal font-normal"
//                 type="date"
//                 name={fieldName}
//                 required={fieldData.required}
//                 defaultValue={formType==="addForm" ? 
//                 (fieldData.default || "") : (
//                   particularData && fieldName in particularData.data.attributes
//                       ? particularData.data.attributes[fieldName]
//                       : ""
//                 )}
//                 id={fieldName}
//                 //   onChange={handleChange}
//               />
//             </div>
//           );
//           break;

//         case "text":
//         case "richtext":
//           inputElement = (
//             <div key={index} className="grid grid-cols-1 w-full max-w-sm items-center gap-2">
//               <Textarea
//                 className="placeholder:font-normal font-normal"
//                 placeholder={fieldName}
//                 required={fieldData.required}
//                 name={fieldName}
//                 minLength={fieldData.minLength}
//                 maxLength={fieldData.maxLength}
//                 defaultValue={formType==="addForm" ? 
//                 (fieldData.default || "") : (
//                   particularData && fieldName in particularData.data.attributes
//                       ? particularData.data.attributes[fieldName]
//                       : ""
//                 )}
//                 id={fieldName}
//                 rows={5}
//                 //  onChange={handleChange}
//               />
//             </div>
//           );
//           break;

//         case "media":
//           inputElement = (
//             <div key={index} className="grid grid-cols-1 w-full max-w-sm items-center gap-2">
//               <Input
//                 type="file"
//                 id={fieldName}
//                 accept={fieldData.allowedTypes.join(",")}
//                 multiple={fieldData.multiple}
//                 name={fieldName}
//                 required={fieldData.required}
//                 // onChange={handleFileChange}
//               />
//               </div>
//           );
//           break;

//         default:
//           inputElement = null;
//       }

//       return (
//         fieldData.type !== "relation" && (
//           <div key={index}>
//             <Label htmlFor={fieldName} className="text-xs text-gray-600">{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</Label>
//             {inputElement}
//           </div>
//         ))
//     }
//   );

//   // form submit handling functions
//   const initialState: ProductFormStateTypeProps = { message: null, error: null, success: null };
//   const submitDataWithBinding = formType==="addForm" ? (
//       moduleName===null ? "" : createDynamicModuleData.bind(null, moduleName)
//     ) : (
//       moduleName===null ? "" : updateDynamicModuleData.bind(null, moduleName, userId)
//     );
//   const serverAction: any = submitDataWithBinding;  
//   const [state, dispatch] = useFormState(serverAction, initialState);

//   // error handling 
//   if (state.success === false) {
//     toast.error(state.error);
//     state.success = null;
//     state.error = null;
//   } else if (state.success === true) {
//     toast.success(state.message);
//     state.success = null;
//     state.message = null;
//     setTimeout(() => {
//       router.push(`/admin/${moduleName}`)
//     }, 1000)
//   }

//   return (
//     <>
//       <div className="py-3 sm:py-6 pb-10 relative">
//           <Toaster position="top-right" theme="dark" richColors />
//           <h1 className="text-2xl px-3 sm:px-6 mb-4">{formType==="addForm" ? "Add" : "Update"} {moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}</h1>
          
//           <div className="overflow-x-auto overflow-y-auto w-full h-[75vh] px-3 sm:px-6">

//             <form action={dispatch} className="flex flex-col gap-3">
//               {formElements.map((curElem, index) => (
//                 <>
//                   {curElem}
//                 </>
//               ))}

//               <div className="grid w-full max-w-sm items-center gap-2">
//                 <Button type="submit">Submit</Button>
//               </div>        
//             </form>

//           </div>
//       </div>
//     </>
//   );
// }

// export default DynamicForm


//OLD ONE ------------------------------------------------------------------------------------------------------------

// const DynamicForm = ({ data }: { data: any }) => {
//     // console.log("aaaaaaaaaaaa", data);
    
//   return (
//     <>
//         <div className="py-3 sm:py-6">
//             <h1 className="text-2xl px-3 sm:px-6 mb-4">Add {data?.apiID}</h1>

//             <div className="overflow-x-auto overflow-y-auto w-full h-[75vh] px-3 sm:px-6">

//                 <form action="{dispatch}" className="flex flex-col gap-3">

//                     {
//                         data?.formFields?.map((curElem: any, index: any) => {
//                             return (
//                                 <div key={index} className="grid w-full max-w-sm items-center gap-2">
//                                     <Label htmlFor={curElem?.name} className="text-xs">{curElem?.label}</Label>
//                                     {
//                                         curElem.type=="string" ?
//                                         <Input 
//                                             name={curElem?.name}
//                                             type="string"
//                                             minLength={curElem?.minLength ? curElem?.minLength : ""} //string
//                                             maxLength={curElem?.maxLength ? curElem?.maxLength : ""}
//                                             required={curElem?.required ? curElem?.required : false}
//                                             id={curElem?.name} 
//                                             placeholder={curElem?.placeholder} 
//                                             className="font-normal" 
//                                             // defaultValue={data===null ? "" : data?.title} 
//                                         />
//                                         :
//                                         curElem.type=="integer" ?
//                                         <Input 
//                                             name={curElem?.name}
//                                             type="number"
//                                             min={curElem?.minLength ? curElem?.minLength : ""} //string
//                                             max={curElem?.maxLength ? curElem?.maxLength : ""}
//                                             required={curElem?.required ? curElem?.required : false}
//                                             id={curElem?.name} 
//                                             placeholder={curElem?.placeholder} 
//                                             className="font-normal" 
//                                             // defaultValue={data===null ? "" : data?.title} 
//                                         />
//                                         :
//                                         ""
//                                     }
//                                     <span className="text-xs font-normal text-gray-300">{curElem?.description}</span>
//                                 </div>
//                             )
//                         })
//                     }
                    


//                     <div className="grid w-full max-w-sm items-center gap-2">
//                         <Button type="submit">Submit</Button>
//                     </div>



//                 </form>

//             </div>
//         </div>
//     </>
//   )
// }

      // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      //   // Handle input change
      // };
    
      // const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
      //   // Handle checkbox change
      // };
    
      // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      //   // Handle file input change
      // };