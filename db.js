require("dotenv").config();
const {MongoClient, ObjectId} =require("mongodb");

// SINGLETON
let singleton;


async function connect() {

    if(singleton) return singleton;
    
    const client = new MongoClient(process.env.MONGO_HOST);
    await client.connect();

    singleton = client.db(process.env.MONGO_DATABASE);

    return singleton;
    
}

async function insert(customer) {
    const db = await connect();
    return db.collection("customers").insertOne(customer);
}

async function find() {
  const db = await connect();
  // return db.collection("customers").findOne({ name: "Luiz" }); // O ".find()" Retorna mais de 1 (se tiver mais de 1), o ".findOne()" retorna apenas 1, vc pose colar filtros dentro dessa função no primeiro parâmetro, no exelmplo vai buscar quem tem o "name" igual a "Luiz" (Se tiver esse nome);
  // return db.collection("customers").find({ name: "Luiz" }); // O ".find()" Retorna mais de 1 (se tiver mais de 1), o ".findOne()" retorna apenas 1, vc pose colar filtros dentro dessa função no primeiro parâmetro no exelmplo vai buscar quem tem o "name" igual a "Luiz" (Se tiver esse nome);
  return db.collection("customers").find().toArray(); // Vai devolver um "Array" com todos os registros;
}

async function remove(id) {
    const db = await connect();
    return db.collection("customers").deleteOne({_id: new ObjectId(id) });
}

async function update(id, name, idade) {
    const db = await connect();
    // return db.collection("customers").updateMany(); // Se quiser "editar" mais de 1, tem que passar o filtro como parâmetro;
    return db.collection("customers").updateOne({ _id: new ObjectId(id) }, {$set: { name }}); // 1º - Parâmetro: Quem vc quero "Editar"; 2º - Parâmetro: O que vc quer "Editar";
    // return db.collection("customers").updateOne({ _id: new ObjectId(id) }, {$set: { name, idade }}); // 1º - Parâmetro: Quem vc quero "Editar"; 2º - Parâmetro: O que vc quer "Editar";
}

module.exports = {
    insert,
    find,
    remove,
    update
}