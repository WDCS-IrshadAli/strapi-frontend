import React from 'react'
import DynamicForm from '@/app/ui/DynamicForm'
import { getContentManagerApi, getDynamicForm, getPaticularDynamicModuleData } from '@/app/lib/strapi'
import { auth } from '@/auth';

const EditDynamicForm = async ({ params }: { params: any }) => {
  const sessionData = await auth();
  const token: any = sessionData?.user?.token;

  let moduleNameForUri: any = params?.modules.slice(0,-1);  
  const getModuleFieldsData: any = await getDynamicForm(moduleNameForUri, token);
  const getParticularData: any = await getPaticularDynamicModuleData(params.modules, params, token);
  const getContentManagerData: any = await getContentManagerApi(moduleNameForUri);

  return (
    <>
      <DynamicForm data={getModuleFieldsData} moduleName={params?.modules} particularData={getParticularData} userId={params?.id} formType="editForm" configureViewData={getContentManagerData} token={token} /> 
    </>
  )
}

export default EditDynamicForm