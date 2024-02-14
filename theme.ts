/* eslint-disable @typescript-eslint/no-explicit-any */
import chroma from 'chroma-js';

const CSS_ID_PREFIX = 'liwe3-colors-';
const ranges_up = [ 900, 800, 700, 600 ];
const ranges_down = [  500, 400, 300, 200, 100, 50 ];
const ranges = [ ranges_up, ranges_down ];

const calculateColors = ( name: string, r: number, g: number, b: number ) => {
	const colors = {
		[ `${ name }` ]: chroma( r, g, b ).css(),
		[ `${ name }-900` ]: chroma( r, g, b ).css()
	};
	ranges.forEach( ( range:number[], idx:number ) => {
		const factor:number = (idx === 0) ? 1 : -1; 
		range.forEach( ( val ) => {
			const col = chroma( r, g, b ).brighten( ( 500 - val ) / 300 );

			colors[ `${ name }-${ val }` ] = col.css();

			// also calculate the right text color for the background
			colors[ `${ name }-${ val }-text` ] = col.luminance() > 0.5 ? '#000' : '#fff';

			// calculate the border color
			colors[ `${ name }-${ val }-border` ] = chroma( r, g, b )
				.darken( ( 700 + (val * factor ) ) / 300 )
				.css();

			// calculate the hover color
			colors[ `${ name }-${ val }-hover` ] = chroma( r, g, b )
				.brighten( ( 300 + (val * factor ) ) / 200 )
				.css();

			// calculate the clicked color
			colors[ `${ name }-${ val }-active` ] = chroma( r, g, b )
				.darken( ( 600 + ( val * factor ) ) / 200 )
				.css();

			// calculate the disabled color
			colors[ `${ name }-${ val }-disabled` ] = chroma( r, g, b )
				.brighten( ( 800 + ( val * factor ) ) / 100 )
				.css();

			// calculate the disabled text color
			colors[ `${ name }-${ val }-disabled-text` ] = '#ccc';
		});
	});

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

type CurrentThemeColorsType = Array<Record<string, Record<string, number[]>>>;
let currentThemeColors: CurrentThemeColorsType= [];

export const themeColors = (): CurrentThemeColorsType => currentThemeColors;

export const themeCreate = ( colorsArray: CurrentThemeColorsType ) => {
	let modes: any = {};
	let name: string = 'colors';
	let colors: Record<string, number[]> = {};

	currentThemeColors = colorsArray;

	currentThemeColors.forEach( ( theme ) => {
		name = Object.keys( theme )[ 0 ];
		colors = theme[ name ];
		Object.entries( colors ).forEach( ( [ mode, values ] ) => {
			const mode_colors = calculateColors( `liwe3-${name}-${mode}`, values[ 0 ], values[ 1 ], values[ 2 ] );
			modes = { ...modes, ...mode_colors };
		} );

		modes = { ...modes, ...calculateColors( 'liwe3-dark', 80, 80, 80 ) };
		//console.log( 'modes', modes );
		injectColors( name, modes );
	} );
};
