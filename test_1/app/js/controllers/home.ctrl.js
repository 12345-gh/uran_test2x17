function HomeCtrl() {

	// ViewModel
	const vm = this;

	vm.title = 'Input mask test task';

	vm.masks = [
		{
			name: 'date',
			mask: '00/00/0000',
			model: null,
		},
		// {
		// 	name: 'time',
		// 	mask: '00:00:00',
		// 	model: null,
		// },{
		// 	name: 'date time',
		// 	mask: '00/00/0000 00:00:00',
		// 	model: null,
		// },{
		// 	name: 'cep',
		// 	mask: '00000-000',
		// 	model: null,
		// },{
		// 	name: 'phone',
		// 	mask: '0000-0000',
		// 	model: null,
		// },{
		// 	name: 'phone with ddd',
		// 	mask: '(00) 0000-0000',
		// 	model: null,
		// },{
		// 	name: 'phone us',
		// 	mask: '(000) 000-0000',
		// 	model: null,
		// },{
		// 	name: 'mixed',
		// 	mask: 'AAA 000-S0S',
		// 	model: null,
		// },{
		// 	name: 'ip address',
		// 	mask: '099.099.099.099',
		// 	model: null,
		// },
	];

}

export default {
	name: 'HomeCtrl',
	fn: HomeCtrl
};
