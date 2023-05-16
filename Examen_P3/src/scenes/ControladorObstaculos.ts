const createKey = (nombre: string, id: number) => { 
	//método helper para añadir a un map y crear un key con este formatillo
	return `${nombre}-${id}`
}
//le debemos pasar la instancia al jugador
export default class ControladorObstaculos
{
	private obstaculos = new Map<string, MatterJS.BodyType>() //creamos el mapa

	add(nombre: string, body: MatterJS.BodyType) //aqui añadimos al mapa
	{
		const key = createKey(nombre, body.id)
		if (this.obstaculos.has(key)) //evitamos repetidos
		{
			throw new Error('ya existe Obstaculo con mismo key')
		}
		this.obstaculos.set(key, body)
	}

	is(nombre: string, body: MatterJS.BodyType) //aqui consultamos en el mapa
	{
		const key = createKey(nombre, body.id)
		if (!this.obstaculos.has(key))
		{
			return false
		}

		return true
	}
}