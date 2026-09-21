export const handler = async(event: any)=>{
    console.log('Mensaje por consola para eventos CDK - Lambda', event);
    return{
        message:'Ejemplo Lambda - NoHome',
    };
};