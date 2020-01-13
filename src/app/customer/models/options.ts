export class FilterOptions {
	public static options = [
		{ id: 'exact', name: 'Exact', isDate: true, isNumeric: true, isString: true, icon: '../../../../assets/images/filter/exect-icon.svg' },
		{ id: 'contains', name: 'Contains', isDate: false, isNumeric: false, isString: true, icon: '../../../../assets/images/filter/similarity.svg' },
		{ id: 'from', name: 'From', isDate: true, isNumeric: false, isString: false, icon: '../../../../assets/images/filter/from-icon.svg' },
		{ id: 'to', name: 'To', isDate: true, isNumeric: false, isString: false, icon: '../../../../assets/images/filter/to-icon.svg' }
	];

	public static getAllOptions(idsOnly: boolean, namesOnly: boolean, both: boolean) {
		const opts = [];
		this.options.forEach(f => {
			if (idsOnly) {
				opts.push(f.id);
			} else if (namesOnly) {
				opts.push(f.name);
			} else {
				opts.push({ id: f.id, name: f.name });
			}
		});
		return opts;
	}

	public static getDateOptions(idsOnly: boolean, namesOnly: boolean, both: boolean) {
		const opts = [];
		this.options.forEach(f => {
			if (f.isDate) {
				if (idsOnly) {
					opts.push(f.id);
				} else if (namesOnly) {
					opts.push(f.name);
				} else {
					opts.push({ id: f.id, name: f.name });
				}
			}
		});
		return opts;
	}
	public static getStringOptions(idsOnly: boolean, namesOnly: boolean, both: boolean) {
		const opts = [];
		this.options.forEach(f => {
			if (f.isString) {
				if (idsOnly) {
					opts.push(f.id);
				} else if (namesOnly) {
					opts.push(f.name);
				} else {
					opts.push({ id: f.id, name: f.name });
				}
			}
		});
		return opts;
	}
	public static getNumericOptions(idsOnly: boolean, namesOnly: boolean, both: boolean) {
		const opts = [];
		this.options.forEach(f => {
			if (f.isNumeric) {
				if (idsOnly) {
					opts.push(f.id);
				} else if (namesOnly) {
					opts.push(f.name);
				} else {
					opts.push({ id: f.id, name: f.name });
				}
			}
		});
		return opts;
	}

	public static getFieldIcon(id: string) {
		let icon = '';
		this.options.forEach(f => {
			if (id == f.id) {
				icon = f.icon;
			}
		});
		return icon;
	}
	public static getFieldIconByName(name: string) {
		let icon = '';
		this.options.forEach(f => {
			if (name == f.name) {
				icon = f.icon;
			}
		});
		return icon;
	}

}
