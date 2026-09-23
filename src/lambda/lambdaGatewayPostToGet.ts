import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

interface IPokeApiType {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

interface IPokeApiResponse {
    id: number;
    name: string;
    weight: number;
    height: number;
    types: IPokeApiType[];
}

export const handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>=>{
    console.log('Mensaje por consola para eventos CDK - Lambda-Gateway - PostToGet', event);
    try{
        if (!event.body){
            return{
                statusCode:400,
                body:JSON.stringify({
                    message:'El cuerpo (body) de la petición es obligatorio'
                })
            }
        }

        const body = JSON.parse(event.body);
        const {pokemon} = body;

        if(!pokemon){
            return{
                statusCode:400,
                body:JSON.stringify({
                    message:'El campo pokemon es obligatorio'
                })
            }
        }

        const baseUrl = process.env.URL as string;
        const url = `${baseUrl}${pokemon.toLowerCase()}`;
        console.log('Consultando PokeAPI para: ${pokemon} - URL: ${url}');

        const response =  await fetch(url);

        if(!response.ok){
            if(response.status === 404){
                return{
                    statusCode: 404,
                    body: JSON.stringify({
                        message: `No se encontró a ${pokemon} en la PokeAPI`
                    })
                }
            }
            throw new Error(`Error en la PokeAPI: ${response.statusText}`);
        }

        const pokemonData = (await response.json()) as IPokeApiResponse;

        return{
            statusCode:200,
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                mensaje: `El pokemon ${pokemon} fue consultado exitosamente en la PokeAPI`,
                data: {
                    id:pokemonData.id,
                    nombre:pokemonData.name,
                    peso:pokemonData.weight,
                    altura:pokemonData.height,
                    tipos:pokemonData.types.map((type:any)=>type.type.name)
                }
            })
        };

    }catch(error:any){
        console.error('Error en Lambda-Gateway PostToGet', error);
        return{
            statusCode:500,
            body:JSON.stringify({
                message:'Error interno en Lambda-Gateway PostToGet',
                error:error.message,
            })
        }
    }
};