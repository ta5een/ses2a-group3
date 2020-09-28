const create = async (params, credentials, group) => {
	try {
		let response = await fetch('/api/groups/by/' + params.userId, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + credentials.t
			},
			body: group
		});
		return response.json();
	} catch (err) {
		console.log(err);
	}
};

const list = async (signal) => {
	try {
		let response = await fetch('/api/groups/', {
			method: 'GET',
			signal: signal
		});
		return await response.json();
	} catch (err) {
		console.log(err);
	}
};

const read = async (params, signal) => {
	try {
		let response = await fetch('/api/groups/' + params.groupId, {
			method: 'GET',
			signal: signal,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});
		return await response.json();
	} catch (err) {
		console.log(err);
	}
};

const update = async (params, credentials, group) => {
	try {
		let response = await fetch('/api/groups/' + params.groupId, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + credentials.t
			},
			body: group
		});
		return await response.json();
	} catch (err) {
		console.log(err);
	}
};

const remove = async (params, credentials) => {
	try {
		let response = await fetch('/api/groups/' + params.groupId, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + credentials.t
			}
		});
		return await response.json();
	} catch (err) {
		console.log(err);
	}
};

const listByInstructor = async (params, credentials, signal) => {
	try {
		let response = await fetch('/api/groups/by/' + params.userId, {
			method: 'GET',
			signal: signal,
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + credentials.t
			}
		});
		return response.json();
	} catch (err) {
		console.log(err);
	}
};

const newContent = async (params, credentials, content) => {
	try {
		let response = await fetch('/api/groups/' + params.groupId + '/content/new', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + credentials.t
			},
			body: JSON.stringify({ content: content })
		});
		return response.json();
	} catch (err) {
		console.log(err);
	}
};
const listPublished = async (signal) => {
	try {
		let response = await fetch('/api/groups/published', {
			method: 'GET',
			signal: signal,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});
		return await response.json();
	} catch (err) {
		console.log(err);
	}
};
const listCategories = async (signal) => {
	try {
		let response = await fetch('/api/groups/categories', {
			method: 'GET',
			signal: signal
		});
		return response.json();
	} catch (err) {
		console.log(err);
	}
};

const listSearch = async (params, signal) => {
	const query = queryString.stringify(params);
	try {
		let response = await fetch('/api/groups?' + query, {
			method: 'GET'
		});
		return response.json();
	} catch (err) {
		console.log(err);
	}
};

export { create, list, read, update, remove, listByInstructor, newContent, listPublished, listCategories, listSearch };
