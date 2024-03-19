import type { Color } from '$liwe3/types/types';
import { get, writable } from 'svelte/store';
import { themeCreate } from './theme';
import { browser } from '$app/environment';

type ThemeStore = {
	theme: 'light' | 'dark';
	light: Record<string, string>;
	dark: Record<string, string>;
	vars: Record<string, string>;
};

// define default modes
export const themeModes: Color[] = [
	'mode1',
	'mode2',
	'mode3',
	'mode4',
	'info',
	'error',
	'warning',
	'success',
	'dark',
	'background',
	'color',
	'link'
];

/*
// define default layout vars
export const themeLayoutVars: LayoutVars[] = [
	'font-size',
	'font-weight',
	'line-height',
	'border-radius',
	'border-width',
	'border-style',
	'button-padding-y',
	'button-padding-x',
	'input-padding-y',
	'input-padding-x'
];
*/

export const themeLayoutUnits: Record<string, string> = {
	'font-size': 'px',
	'font-weight': 'number',
	'line-height': 'rem',
	'border-radius': 'rem',
	'border-width': 'px',
	'border-style': 'string',
	'button-padding-y': 'rem',
	'button-padding-x': 'rem',
	'input-padding-y': 'rem',
	'input-padding-x': 'rem'
};

// create a writable store for the LiWEUser
export const theme = writable<ThemeStore>( {
	theme: 'light',
	light: {
		mode1: '#ff0000',
		mode2: '#00ff00',
		mode3: '#0000ff',
		mode4: '#ffff00',
		info: '#0000ff',
		error: '#ff0000',
		warning: '#ffff00',
		success: '#00ff00',
		dark: '#000000',
		background: '#ffffff',
		color: '#000000',
		link: '#0000ff'
	},
	dark: {
		mode1: '#00ff00',
		mode2: '#ff0000',
		mode3: '#0000ff',
		mode4: '#ffff00',
		info: '#0000ff',
		error: '#ff0000',
		warning: '#ffff00',
		success: '#00ff00',
		dark: '#000000',
		background: '#000000',
		color: '#ffffff',
		link: '#0000ff'
	},
	vars: {
		'font-size': '20px',
		'font-weight': '400',
		'line-height': '1.2rem',
		'border-radius': '0.15rem',
		'border-width': '1px',
		'border-style': 'solid',
		'button-padding-y': '0.25rem',
		'button-padding-x': '0.1rem',
		'input-padding-y': '0.15rem',
		'input-padding-x': '0.15rem'
	}
} );

export const themeGet = ( mode: 'light' | 'dark' ) => {
	const store = get( theme );
	if ( !store ) return {};

	return store[ mode ];
};

export const themeSetDarkMode = ( dark: boolean ) => {
	const store = get( theme );
	if ( !store ) return;

	store.theme = dark ? 'dark' : 'light';
	theme.set( store );
};

export const themeModeGet = () => {
	const store = get( theme );
	if ( !store ) return 'light';

	return store.theme;
};

export const themeModeSet = ( mode: 'light' | 'dark' ) => {
	const store = get( theme );
	if ( !store ) return;

	store.theme = mode;
	theme.set( store );
};

export const themeSetModeColors = ( mode: 'light' | 'dark', color: Record<string, string> ) => {
	const store = get( theme );
	if ( !store ) return;

	store[ mode ] = color;
	theme.set( store );
};

export const themeSetModeColor = ( type: 'light' | 'dark', mode: string, color: string ) => {
	const store = get( theme );
	if ( !store ) return;

	store[ type ][ mode ] = color;
	theme.set( store );

	themeCreate( { [ type ]: store[ type ] } );

	if ( browser ) {
		// save the theme to local storage
		localStorage.setItem( `liwe3-${ store.theme }-theme`, JSON.stringify( store[ store.theme ] ) );
	}
};

export const themeSetLayoutVars = ( vars: Record<string, string> ) => {
	const store = get( theme );
	if ( !store ) return;

	store.vars = vars;
	theme.set( store );
};

export const themeSetLayoutVar = ( name: string, value: string ) => {
	const store = get( theme );
	if ( !store ) return;

	store.vars[ name ] = value;
	theme.set( store );

	themeCreate( { vars: store.vars } );
	if ( browser ) {
		localStorage.setItem( 'liwe3-layout-vars', JSON.stringify( store.vars ) );
	}
}

/*
export let liwe3Theme: ThemeStore;

// subscribe to the user store
theme.subscribe( ( value ) => {
	liwe3Theme = value;
} );
*/