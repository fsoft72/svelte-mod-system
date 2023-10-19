/* eslint-disable @typescript-eslint/no-explicit-any */
import chroma from 'chroma-js';

const CSS_ID_PREFIX = 'liwe3-colors-';
const ranges = [ 900, 800, 700, 600, 500, 400, 300, 200, 100, 50 ];

const calculateColors = ( name: string, r: number, g: number, b: number ) => {
	const colors = {
		[ `${ name }` ]: chroma( r, g, b ).css(),
		[ `${ name }-900` ]: chroma( r, g, b ).css()
	};

	ranges.forEach( ( val ) => {
		const col = chroma( r, g, b ).brighten( ( 900 - val ) / 300 );

		colors[ `${ name }-${ val }` ] = col.css();

		// also calculate the right text color for the background
		colors[ `${ name }-${ val }-text` ] = col.luminance() > 0.5 ? '#000' : '#fff';

		// calculate the border color
		colors[ `${ name }-${ val }-border` ] = chroma( r, g, b )
			.darken( ( 900 - val ) / 300 )
			.css();

		// calculate the hover color
		colors[ `${ name }-${ val }-hover` ] = chroma( r, g, b )
			.brighten( ( 900 - val ) / 200 )
			.css();

		// calculate the clicked color
		colors[ `${ name }-${ val }-active` ] = chroma( r, g, b )
			.darken( ( 900 - val ) / 200 )
			.css();

		// calculate the disabled color
		colors[ `${ name }-${ val }-disabled` ] = chroma( r, g, b )
			.brighten( ( 900 - val ) / 100 )
			.css();

		// calculate the disabled text color
		colors[ `${ name }-${ val }-disabled-text` ] = '#ccc';
	} );

	colors[ `${ name }-variant` ] = colors[ `${ name }-700` ];
	colors[ `${ name }-accent` ] = colors[ `${ name }-500` ];

	return colors;
};

// this function takes the name of the color and the object returned by calculateColors
// and injects the css variables in the document
const injectColors = ( name: string, colors: Record<string, string> ) => {
	let style = document.getElementById( CSS_ID_PREFIX + name );
	let is_new = false;

	if ( !style ) {
		style = document.createElement( 'style' );
		is_new = true;
	}
	style.id = CSS_ID_PREFIX + name;
	style.innerHTML =
		`:root {\n` +
		Object.entries( colors )
			.map( ( [ key, value ] ) => `--${ key }: ${ value };` )
			.join( '\n' ) +
		'\n}';

	if ( is_new ) document.head.appendChild( style );
};

let currentThemeColors: Record<string, number[]> = {};

export const themeColors = (): Record<string, number[]> => currentThemeColors;

export const themeCreate = ( name: string, colors: Record<string, number[]> ) => {
	let modes: any = {};

	currentThemeColors = { ...currentThemeColors, ...colors };

	Object.entries( currentThemeColors ).forEach( ( [ mode, values ] ) => {
		const mode_colors = calculateColors( 'liwe3-' + mode, values[ 0 ], values[ 1 ], values[ 2 ] );
		modes = { ...modes, ...mode_colors };
	} );

	modes = { ...modes, ...calculateColors( 'liwe3-dark', 80, 80, 80 ) };

	injectColors( name, modes );
};
