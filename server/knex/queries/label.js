const knex = require('../knex');//connection

module.exports = {
	getAll(){
		return knex('label');
	},
	getOne(id){
		return knex('label').where('id', id).first();
	},
	create(data){
		return knex('label').insert(data, '*');
	},
	update(id, data){
		return knex('label').where('id', id).update(data, '*');
	},
	delete(id){
		return knex('label').where('id', id).del();
	}
}