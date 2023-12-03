/* This file is autogenerated by liwe3-svelte */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/*=== f2c_start __file ===*/

/*=== f2c_end __file ===*/

import { get, patch, post, delete_ } from '$liwe3/utils/fetcher';

/**
 * List all visible domains
 *
 *
 * @return domains: SystemDomain
 *
 */
export const system_domains_list = async () => {
	const res = await get( `/api/system/domains/list`, {}, true );

	if ( res.error ) return res;

	/*=== f2c_start system_domains_list ===*/

	/*=== f2c_end system_domains_list ===*/

	return res.domains;
};

/**
 * Set the current domain for the user
 *
 * @param code - the domain unique code [req]
 *
 * @return domain: SystemDomain
 *
 */
export const system_domain_set = async ( code: string ) => {
	const res = await post( `/api/system/domain/set`, { code }, true );

	if ( res.error ) return res;

	/*=== f2c_start system_domain_set ===*/

	/*=== f2c_end system_domain_set ===*/

	return res.domain;
};

/**
 * Adds a new domain to the System.
 *
 * @param code - the domain unique code [req]
 * @param name - the domain name [req]
 * @param visible - if the domain is visible or not [default: true] [opt]
 *
 * @return domain: SystemDomain
 *
 */
export const system_admin_domain_add = async ( code: string, name: string, visible?: boolean ) => {
	const res = await post( `/api/system/admin/domain/add`, { code, name, visible }, true );

	if ( res.error ) return res;

	/*=== f2c_start system_admin_domain_add ===*/

	/*=== f2c_end system_admin_domain_add ===*/

	return res.domain;
};

/**
 * Updates a domain in the system. The `id` field must be provided.
 *
 * @param id - the domain id [req]
 * @param code - the domain unique code [opt]
 * @param name - the domain name [opt]
 * @param visible - if the domain is visible or not [opt]
 *
 * @return domain: SystemDomain
 *
 */
export const system_admin_domain_update = async ( id: string, code?: string, name?: string, visible?: boolean ) => {
	const res = await patch( `/api/system/admin/domain/update`, {
		code,
		id,
		name,
		visible
	}, true );

	if ( res.error ) return res;

	/*=== f2c_start system_admin_domain_update ===*/

	/*=== f2c_end system_admin_domain_update ===*/

	return res.domain;
};

/**
 * Delete a domain from the system. You can specify both `id` and `code` for deletion
 *
 * @param id - the domain id [opt]
 * @param code - the domain unique code [opt]
 *
 * @return id_domain: str
 *
 */
export const system_admin_domain_del = async ( id?: string, code?: string ) => {
	const res = await delete_( `/api/system/admin/domain/del`, { id, code }, true );

	if ( res.error ) return res;

	/*=== f2c_start system_admin_domain_del ===*/

	/*=== f2c_end system_admin_domain_del ===*/

	return res.id_domain;
};

/**
 * List all domains
 *
 *
 * @return domains: SystemDomainAdmin
 *
 */
export const system_admin_domains_list = async () => {
	const res = await get( `/api/system/admin/domains/list`, {}, true );

	if ( res.error ) return res;

	/*=== f2c_start system_admin_domains_list ===*/

	/*=== f2c_end system_admin_domains_list ===*/

	return res.domains;
};

/**
 * Changes something in the system theme.
 *
 * @param changes - the main changes [opt]
 *
 * @return theme: SystemTheme
 *
 */
export const system_admin_theme_set = async ( changes?: any ) => {
	const res = await patch( `/api/system/admin/theme/set`, { changes }, true );

	if ( res.error ) return res;

	/*=== f2c_start system_admin_theme_set ===*/

	/*=== f2c_end system_admin_theme_set ===*/

	return res.theme;
};

/**
 *
 * @return theme: SystemTheme
 *
 */
export const system_theme_get = async () => {
	const res = await get( `/api/system/theme/get`, {}, true );

	if ( res.error ) return res;

	/*=== f2c_start system_theme_get ===*/

	/*=== f2c_end system_theme_get ===*/

	return res.theme;
};

/**
 * Force an id to be changed on the system.
 * You have to specify the current `id`, the new `id` and the `collection` name.
 *
 * @param id - the current id [req]
 * @param new_id - the new id [req]
 * @param collection - the collection name [req]
 *
 * @return id: str
 *
 */
export const system_admin_reset_id = async ( id: string, new_id: string, collection: string ) => {
	const res = await patch( `/api/system/admin/reset/id`, { id, new_id, collection }, true );

	if ( res.error ) return res;

	/*=== f2c_start system_admin_reset_id ===*/

	/*=== f2c_end system_admin_reset_id ===*/

	return res.id;
};

/**
 * This endpoint tests email sending.
 * You can specify the destination email address to send the message to, but the message itself is defined by the app.
 *
 * @param email - Destination email address [req]
 *
 * @return result: boolean
 *
 */
export const system_email_test = async ( email: string ) => {
	const res = await post( `/api/system/email/test`, { email }, true );

	if ( res.error ) return res;

	/*=== f2c_start system_email_test ===*/

	/*=== f2c_end system_email_test ===*/

	return res.result;
};

/**
 * Returns all the permissions available in the System.
 * The list depends also on the user's permissions:
 * - If the user has `system.admin`, the endpoint will return **all permissions** available
 * - if the user doesn't have `system.admin` the endpoint will return **only the permissions the user already has**.
 * Permissions are returned in an object with: `module name` as key and a string list of permissions available for that module.
 *
 *
 * @return permissions: json
 *
 */
export const system_admin_permissions_list = async () => {
	const res = await get( `/api/system/admin/permissions/list`, {}, true );

	if ( res.error ) return res;

	/*=== f2c_start system_admin_permissions_list ===*/

	/*=== f2c_end system_admin_permissions_list ===*/

	return res.permissions;
};

/**
 *
 * @return domain: SystemDomainPublic
 *
 */
export const system_domain_current = async () => {
	const res = await get( `/api/system/domain/current`, {}, true );

	if ( res.error ) return res;

	/*=== f2c_start system_domain_current ===*/

	/*=== f2c_end system_domain_current ===*/

	return res.domain;
};

/**
 * This endpoint creates an invitation token for a domain.
 * The invitation can have an `expire` date, so you can create temporary tokens.
 * The `expire` field is expressed in `minutes`. If you specify a value different that `0`, the token will last the `expire` minutes.
 * If the `expire` is set to `0` (default), the token does not expire.
 *
 * @param id_domain - The Domain ID to create the invite for [req]
 * @param expire - The amount of minutes the link is valid [opt]
 *
 * @return token: str
 *
 */
export const system_domain_create_invite = async ( id_domain: string, expire: number = 0 ) => {
	const res = await get( `/api/system/domain/create/invite`, { id_domain, expire }, true );

	if ( res.error ) return res;

	/*=== f2c_start system_domain_create_invite ===*/

	/*=== f2c_end system_domain_create_invite ===*/

	return res.token;
};
