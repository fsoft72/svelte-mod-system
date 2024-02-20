/* eslint-disable @typescript-eslint/no-explicit-any */
import chroma from 'chroma-js';

const CSS_ID_PREFIX = 'liwe3-colors-';
const ranges_up = [ 900, 800, 700, 600 ];
const ranges_down = [ 500, 400, 300, 200, 100, 50 ];
const ranges = [ ranges_up, ranges_down ];

const calculateColors = ( name: string, r: number, g: number, b: number ) => {
	const colors = {
		[ `${ name }` ]: chroma( r, g, b ).css(),
		[ `${ name }-900` ]: chroma( r, g, b ).css()
	};
	ranges.forEach( ( range: number[], idx: number ) => {
		const factor: number = ( idx === 0 ) ? 1 : -1;
		range.forEach( ( val ) => {
			const col = chroma( r, g, b ).brighten( ( 500 - val ) / 300 );

			colors[ `${ name }-${ val }` ] = col.css();

			// also calculate the right text color for the background
			colors[ `${ name }-${ val }-text` ] = col.luminance() > 0.5 ? '#000' : '#fff';

			// calculate the border color
			colors[ `${ name }-${ val }-border` ] = chroma( r, g, b )
				.darken( ( 700 + ( val * factor ) ) / 300 )
				.css();

			// calculate the hover color
			colors[ `${ name }-${ val }-hover` ] = chroma( r, g, b )
				.brighten( ( 300 + ( val * factor ) ) / 200 )
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
		} );
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
		'\n}\n';
	// Inject light and dark theme variables assignements
	// Inject cform variables assignements. NOTE: mode3 is used as default forms color set
	if ( [ 'light', 'dark' ].includes( name ) ) {
		style.innerHTML += `.liwe3-${ name }-theme {\n` +
			Object.entries( colors )
				.map( ( keyVal ) => `--${ keyVal[ 0 ].replace( `-${ name }`, '' ) }: var(--${ keyVal[ 0 ] });` )
				.join( '\n' ) +
			`
				--cform-radius: var(--liwe3-border-radius);
				--cform-font-size: var(--liwe3-font-size);
				--cform-padding: var(--liwe3-padding);
				--cform-border-width: var(--liwe3-border-width);
				--cform-border-width-focus: calc(var(--liwe3-border-width)*2);
				--cform-border-focus-color: var(--liwe3-${ name }-mode4-500-border);
				--cform-bg: var(--liwe3-${ name }-mode3);
				--cform-text-color: var(--liwe3-${ name }-mode3-500-text);
				--cform-accent: var(--liwe3-${ name }-mode4);
				--cform-accent-color: var(--liwe3-${ name }-mode4-700);
				--cform-border-color: var(--liwe3-${ name }-mode3-200-border);
				--cform-focus-bg: var(--liwe3-${ name }-mode3-500-hover);
				--cform-error: var(--liwe3-${ name }-error-500);
				.mode1 {
					--cform-bg: var(--liwe3-${ name }-mode1);
					--cform-text-color: var(--liwe3-${ name }-mode1-500-text);
					--cform-border-color: var(--liwe3-${ name }-mode1-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-mode1-500-hover);
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-mode1);
						--cform-accent-color: var(--liwe3-${ name }-mode1-500-text);
					}
				}
				.mode2 {
					--cform-bg: var(--liwe3-${ name }-mode2);
					--cform-text-color: var(--liwe3-${ name }-mode2-500-text);
					--cform-border-color: var(--liwe3-${ name }-mode2-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-mode2-500-hover);
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-mode2);
						--cform-accent-color: var(--liwe3-${ name }-mode2-500-text);
					}
				}
				.mode3 {
					--cform-bg: var(--liwe3-${ name }-mode3);
					--cform-text-color: var(--liwe3-${ name }-mode3-500-text);
					--cform-border-color: var(--liwe3-${ name }-mode3-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-mode3-500-hover);
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-mode3);
						--cform-accent-color: var(--liwe3-${ name }-mode3-500-text);
					}
				}
				.mode4 {
					--cform-bg: var(--liwe3-${ name }-mode4);
					--cform-text-color: var(--liwe3-${ name }-mode4-500-text);
					--cform-border-color: var(--liwe3-${ name }-mode4-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-mode4-500-hover);
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-mode4);
						--cform-accent-color: var(--liwe3-${ name }-mode4-500-text);
					}
				}
				.link {
					--cform-bg: var(--liwe3-${ name }-link);
					--cform-text-color: var(--liwe3-${ name }-link-500-text);
					--cform-border-color: var(--liwe3-${ name }-link-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-link-500-hover);
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-link);
						--cform-accent-color: var(--liwe3-${ name }-link-500-text);
					}
				}
				.info {
					--cform-bg: var(--liwe3-${ name }-info);
					--cform-text-color: var(--liwe3-${ name }-info-500-text);
					--cform-border-color: var(--liwe3-${ name }-info-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-info-500-hover);
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-info);
						--cform-accent-color: var(--liwe3-${ name }-info-500-text);
					}
				}
				.success {
					--cform-bg: var(--liwe3-${ name }-success);
					--cform-text-color: var(--liwe3-${ name }-success-500-text);
					--cform-border-color: var(--liwe3-${ name }-success-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-success-500-hover);
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-success);
						--cform-accent-color: var(--liwe3-${ name }-success-500-text);
					}
				}
				.warning {
					--cform-bg: var(--liwe3-${ name }-warning);
					--cform-text-color: var(--liwe3-${ name }-warning-500-text);
					--cform-border-color: var(--liwe3-${ name }-warning-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-warning-500-hover);
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-warning);
						--cform-accent-color: var(--liwe3-${ name }-warning-500-text);
					}
				}
				.error {
					--cform-bg: var(--liwe3-${ name }-error);
					--cform-text-color: var(--liwe3-${ name }-error-500-text);
					--cform-border-color: var(--liwe3-${ name }-error-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-error-500-hover);
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-error);
						--cform-accent-color: var(--liwe3-${ name }-error-500-text);
					}
				}
				.cform-custom-input {
					--cform-text-placeholder-color: var(--liwe3-${ name }-mode3-700-text);
					--cform-legend: var(--liwe3-${ name }-mode3-200-border);
					--cform-text-color: var(--liwe3-${ name }-mode3-500-text);
				}

				.cform-custom-switch {
					--cform-text-placeholder-color: var(--liwe3-${ name }-mode3-700-text);
					--cform-radius: var(--liwe3-border-radius);
				}
				.cform-custom-btn {
					--cform-btn-primary: var(--liwe3-${ name }-mode3);
					--cform-btn-default-text: var(--liwe3-${ name }-mode3-500-text);
					--cform-radius: var(--liwe3-border-radius);
				}
				`;
		'\n}\n';
		// console.log( 'Inject colors', name, style.innerHTML );
	}

	if ( is_new ) document.head.appendChild( style );
};

type CurrentThemeColorsType = Array<Record<string, Record<string, number[]>>>;
let currentThemeColors: CurrentThemeColorsType = [];

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
			const mode_colors = calculateColors( `liwe3-${ name }-${ mode }`, values[ 0 ], values[ 1 ], values[ 2 ] );
			modes = { ...modes, ...mode_colors };
		} );

		// modes = { ...modes, ...calculateColors( 'liwe3-dark', 80, 80, 80 ) };
		injectColors( name, modes );
		modes = {};
	} );
};
