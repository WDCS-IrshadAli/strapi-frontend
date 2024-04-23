import React from 'react'
import DynamicForm from '@/app/ui/DynamicForm'
import { getContentManagerApi, getDynamicForm } from '@/app/lib/strapi'
import { auth } from '@/auth'

const AddDynamicForm = async ({ params }: { params: any }) => {
  const sessionData = await auth();
  const token: any = sessionData?.user?.token;
  
  let moduleNameForUri: any = params?.modules.slice(0,-1);  
  const getModuleFieldsData: any = await getDynamicForm(moduleNameForUri, token);
  const getContentManagerData: any = await getContentManagerApi(moduleNameForUri, token);
  
  return (
    <>
      <DynamicForm data={getModuleFieldsData} moduleName={params?.modules} particularData={null} userId={null} formType="addForm" configureViewData={getContentManagerData} token={token} /> 
    </>
  )
}

export default AddDynamicForm