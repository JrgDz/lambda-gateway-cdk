import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

interface IReqResResponse{
    id: string;
    name: string;
    job: string;
    createdAt: string;
}

export const handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>=>{
    console.log('Mensaje CDK Lambda-Gateway - PostToPost', event);
    try{
        if(!event.body){
            return{
                statusCode:400,
                body:JSON.stringify({
                    message:'El cuerpo (body) de la petición es obligatorio'
                })
            }
        }
        const body = JSON.parse(event.body);
        const {name, job} = body;

        if(!name || !job){
            return{
                statusCode:400,
                body:JSON.stringify({
                    message:'Los campos name y job son obligatorios'
                })
            }
        }

        const url = process.env.URL as string;
        console.log(`Enviando datos a ReqRes API -URL: ${url} - Datos: ${JSON.stringify(body)}`);

        const response = await fetch(url,{
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(body)
        })

        if(!response.ok){
            if(response.status === 404){
                return{
                    statusCode: 404,
                    body: JSON.stringify({
                        message: 'No se encontró el recurso en la ReqRes API',
                    })
                }
            }
            throw new Error(`Error en la ReqRes API: ${response.statusText}`);
        }

        const data = (await response.json()) as IReqResResponse;
        return{
            statusCode:201,
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                message:'Se creó correctamente el recurso en la ReqRes API',
                data:{
                    id: data.id,
                    name: data.name,
                    job: data.job,
                    createdAt: data.createdAt
                }
            })
        }
    }catch(error: any){
        console.error('Error interno en Lambda-Gateway PostToPost', error);
        return{
            statusCode:500,
            body:JSON.stringify({
                message: 'Error interno en Lambda-Gateway PostToPost',
                error: error.message
            })
        }
    }
}