import { get } from '$liwe3/utils/fetcher';

async function system_admin_permissions_list () {
	const res = await get( '/api/system/admin/permissions/list', null, true );

	if ( res.error ) {
		console.error( res.error );
	}

	return res;
}


export {
	system_admin_permissions_list,
};