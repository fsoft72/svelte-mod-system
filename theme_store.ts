import type { Color } from '$liwe3/types/types';
import { get, writable } from 'svelte/store';
import { themeCreate } from './theme';
import { browser } from '$app/environment';

type ThemeStore = {
	theme: 'light' | 'dark';
	light: Record<string, string>;
	dark: Record<string, string>;
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


/*
export let liwe3Theme: ThemeStore;

// subscribe to the user store
theme.subscribe( ( value ) => {
	liwe3Theme = value;
} );
*/