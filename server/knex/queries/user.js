const knex = require('../knex');//connection

module.exports = {
	getAll(){
		return knex('user');
	},
	getOne(id){
		return knex('user').where('id', id).first();
	},
	create(data){
		return knex('user').insert(data, '*');
	},
	update(id, data){
		return knex('user').where('id', id).update(data, '*');
	},
	delete(id){
		return knex('user').where('id', id).del();
	}
}