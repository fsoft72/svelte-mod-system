/* eslint-disable @typescript-eslint/no-explicit-any */
import { rgbHexToInt } from '$liwe3/utils/utils';
import chroma from 'chroma-js';
import { theme, themeModeSet, themeSetModeColors } from './theme_store';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

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
			colors[ `${ name }-${ val }-text` ] = col.luminance() > 0.6 ? chroma( 48, 48, 48 ).darken( ( 700 + ( val * factor ) ) / 300 ).css()
				: col.luminance() < 0.4 ? chroma( 242, 242, 242 ).brighten( ( 300 + ( val * factor ) ) / 200 ).css()
					: chroma( 33, 33, 33 ).darken( ( 500 + ( val * factor ) ) / 300 ).css(); // intermediate color

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
		style.id = CSS_ID_PREFIX + name;
		is_new = true;
	}

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
				--cform-padding: var(--liwe3-form-padding-y);
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
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-mode1-500-text) !important;
						--cform-legend: var(--liwe3-${ name }-mode1-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-mode1);
						--cform-accent-color: var(--liwe3-${ name }-mode1-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-mode1-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-mode1-500-text);
					}
				}
				.mode2 {
					--cform-bg: var(--liwe3-${ name }-mode2);
					--cform-text-color: var(--liwe3-${ name }-mode2-500-text);
					--cform-border-color: var(--liwe3-${ name }-mode2-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-mode2-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-mode2-500-text) !important;
						--cform-legend: var(--liwe3-${ name }-mode2-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-mode2);
						--cform-accent-color: var(--liwe3-${ name }-mode2-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-mode2-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-mode2-500-text);
					}
				}
				.mode3 {
					--cform-bg: var(--liwe3-${ name }-mode3);
					--cform-text-color: var(--liwe3-${ name }-mode3-500-text);
					--cform-border-color: var(--liwe3-${ name }-mode3-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-mode3-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-mode3-500-text) !important;
						--cform-legend: var(--liwe3-${ name }-mode3-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-mode3);
						--cform-accent-color: var(--liwe3-${ name }-mode3-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-mode3-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-mode3-500-text);
					}
				}
				.mode4 {
					--cform-bg: var(--liwe3-${ name }-mode4);
					--cform-text-color: var(--liwe3-${ name }-mode4-500-text);
					--cform-border-color: var(--liwe3-${ name }-mode4-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-mode4-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-mode4-500-text) !important;
						--cform-legend: var(--liwe3-${ name }-mode4-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-mode4);
						--cform-accent-color: var(--liwe3-${ name }-mode4-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-mode4-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-mode4-500-text);
					}
				}
				.link {
					--cform-bg: var(--liwe3-${ name }-link);
					--cform-text-color: var(--liwe3-${ name }-link-500-text);
					--cform-border-color: var(--liwe3-${ name }-link-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-link-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-link-500-text) !important;
						--cform-legend: var(--liwe3-${ name }-link-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-link);
						--cform-accent-color: var(--liwe3-${ name }-link-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-link-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-link-500-text);
					}
				}
				.info {
					--cform-bg: var(--liwe3-${ name }-info);
					--cform-text-color: var(--liwe3-${ name }-info-500-text);
					--cform-border-color: var(--liwe3-${ name }-info-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-info-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-info-500-text) !important;
						--cform-legend: var(--liwe3-${ name }-info-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-info);
						--cform-accent-color: var(--liwe3-${ name }-info-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-info-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-info-500-text);
					}
				}
				.success {
					--cform-bg: var(--liwe3-${ name }-success);
					--cform-text-color: var(--liwe3-${ name }-success-500-text);
					--cform-border-color: var(--liwe3-${ name }-success-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-success-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-success-500-text) !important;
						--cform-legend: var(--liwe3-${ name }-success-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-success);
						--cform-accent-color: var(--liwe3-${ name }-success-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-success-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-success-500-text);
					}
				}
				.warning {
					--cform-bg: var(--liwe3-${ name }-warning);
					--cform-text-color: var(--liwe3-${ name }-warning-500-text);
					--cform-border-color: var(--liwe3-${ name }-warning-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-warning-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-warning-500-text);
						--cform-legend: var(--liwe3-${ name }-warning-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-warning);
						--cform-accent-color: var(--liwe3-${ name }-warning-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-warning-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-warning-500-text);
					}
				}
				.error {
					--cform-bg: var(--liwe3-${ name }-error);
					--cform-text-color: var(--liwe3-${ name }-error-500-text);
					--cform-border-color: var(--liwe3-${ name }-error-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-error-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-error-500-text);
						--cform-legend: var(--liwe3-${ name }-error-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-error);
						--cform-accent-color: var(--liwe3-${ name }-error-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-error-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-error-500-text);
					}
				}
				.dark {
					--cform-bg: var(--liwe3-${ name }-background);
					--cform-text-color: var(--liwe3-${ name }-background-500-text);
					--cform-border-color: var(--liwe3-${ name }-background-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-background-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-background-500-text);
						--cform-legend: var(--liwe3-${ name }-background-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-background);
						--cform-accent-color: var(--liwe3-${ name }-background-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-background-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-background-500-text);
					}
				}
				.background {
					--cform-bg: var(--liwe3-${ name }-background);
					--cform-text-color: var(--liwe3-${ name }-background-500-text);
					--cform-border-color: var(--liwe3-${ name }-background-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-background-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-background-500-text);
						--cform-legend: var(--liwe3-${ name }-background-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-background);
						--cform-accent-color: var(--liwe3-${ name }-background-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-background-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-background-500-text);
					}
				}
				.color {
					--cform-bg: var(--liwe3-${ name }-text);
					--cform-text-color: var(--liwe3-${ name }-text-500-text);
					--cform-border-color: var(--liwe3-${ name }-text-200-border);
					--cform-focus-bg: var(--liwe3-${ name }-text-500-hover);
					&.cform-custom-input {
						--cform-text-placeholder-color: var(--liwe3-${ name }-text-500-text);
						--cform-legend: var(--liwe3-${ name }-text-200-border);
					}
					&.cform-custom-checkbox-radio {
						--cform-accent: var(--liwe3-${ name }-text);
						--cform-accent-color: var(--liwe3-${ name }-text-500-text);
					}
					&.cform-radio-group input[type=radio]:checked+label {
						--cform-accent: var(--liwe3-${ name }-text-500-hover);
						--cform-accent-color: var(--liwe3-${ name }-text-500-text);
					}
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
				.cform-radio-group {
					max-width: fit-content;
				}
				.svelte-select {
					--border: var(--liwe3-border-width) solid var(--liwe3-${ name }-mode3-200-border);
					--input-padding: var(--liwe3-form-padding-y);
					--value-container-padding: calc(var(--input-padding) * 5) var(--input-padding);
					.value-container > input {
						padding-block: clamp(1px,var(--input-padding) * 2.5,15px);
						padding-inline: clamp(5px,var(--input-padding) * 4,20px);
					}
					&.xxs {
						padding: 0.12rem 0.2rem !important;
						font-size: 0.75rem;
						min-width: calc(var(--liwe3-input-w-unit) * 4);
					}
					&.xs {
						padding: 0.15rem 0.22rem !important;
						font-size: 0.75rem;
						min-width: calc(var(--liwe3-input-w-unit) * 5);
					}
					&.sm {
						padding: 0.18rem 0.24rem !important;
						font-size: 0.875rem;
						min-width: calc(var(--liwe3-input-w-unit) * 6);
					}
					&.md {
						/* padding is the default value defined in css variables */
						font-size: 1rem;
						min-width: calc(var(--liwe3-input-w-unit) * 7);
					}
					&.lg {
						padding: 0.22rem 0.28rem !important;
						font-size: 1.12rem;
						min-width: calc(var(--liwe3-input-w-unit) * 8);
					}
					&.xl {
						padding: 0.24rem 0.4rem !important;
						font-size: 1.25rem;
						min-width: calc(var(--liwe3-input-w-unit) * 9);
					}
					&.xxl {
						padding: 0.28rem 0.45rem !important;
						font-size: 1.5rem;
						min-width: calc(var(--liwe3-input-w-unit) * 10);
					}
				}
				.svelte-select.mode1 {
					--background: var(--liwe3-${ name }-mode1);
					--border-radius: var(--liwe3-border-radius);
					--border: var(--liwe3-border-width) solid var(--liwe3-${ name }-mode1-200-border);
					--placeholder-color: var(--liwe3-${ name }-mode1-500-text);
					--item-color: var(--liwe3-${ name }-mode1-500-text);
					--item-hover-color: var(--liwe3-${ name }-mode1-500-hover);
					--item-hover-bg: var(--liwe3-${ name }-mode1-700-hover);
					--list-background: var(--liwe3-${ name }-mode1);
				}
				.svelte-select.mode2 {
					--background: var(--liwe3-${ name }-mode2);
					--border-radius: var(--liwe3-border-radius);
					--border: var(--liwe3-border-width) solid var(--liwe3-${ name }-mode2-200-border);
					--placeholder-color: var(--liwe3-${ name }-mode2-500-text);
					--item-color: var(--liwe3-${ name }-mode2-500-text);
					--item-hover-color: var(--liwe3-${ name }-mode2-500-hover);
					--item-hover-bg: var(--liwe3-${ name }-mode2-700-hover);
					--list-background: var(--liwe3-${ name }-mode2);
				}
				.svelte-select.mode3 {
					--background: var(--liwe3-${ name }-mode3);
					--border-radius: var(--liwe3-border-radius);
					--border: var(--liwe3-border-width) solid var(--liwe3-${ name }-mode3-200-border);
					--placeholder-color: var(--liwe3-${ name }-mode3-500-text);
					--item-color: var(--liwe3-${ name }-mode3-500-text);
					--item-hover-color: var(--liwe3-${ name }-mode3-500-hover);
					--item-hover-bg: var(--liwe3-${ name }-mode3-700-hover);
					--list-background: var(--liwe3-${ name }-mode3);
				}
				.svelte-select.mode4 {
					--background: var(--liwe3-${ name }-mode4);
					--border-radius: var(--liwe3-border-radius);
					--border: var(--liwe3-border-width) solid var(--liwe3-${ name }-mode4-200-border);
					--placeholder-color: var(--liwe3-${ name }-mode4-500-text);
					--item-color: var(--liwe3-${ name }-mode4-500-text);
					--item-hover-color: var(--liwe3-${ name }-mode4-500-hover);
					--item-hover-bg: var(--liwe3-${ name }-mode4-700-hover);
					--list-background: var(--liwe3-${ name }-mode4);
				}
				.svelte-select.link {
					--background: var(--liwe3-${ name }-link);
					--border-radius: var(--liwe3-border-radius);
					--border: var(--liwe3-border-width) solid var(--liwe3-${ name }-link-200-border);
					--placeholder-color: var(--liwe3-${ name }-link-500-text);
					--item-color: var(--liwe3-${ name }-link-500-text);
					--item-hover-color: var(--liwe3-${ name }-link-500-hover);
					--item-hover-bg: var(--liwe3-${ name }-link-700-hover);
					--list-background: var(--liwe3-${ name }-link);
				}
				.svelte-select.info {
					--background: var(--liwe3-${ name }-info);
					--border-radius: var(--liwe3-border-radius);
					--border: var(--liwe3-border-width) solid var(--liwe3-${ name }-info-200-border);
					--placeholder-color: var(--liwe3-${ name }-info-500-text);
					--item-color: var(--liwe3-${ name }-info-500-text);
					--item-hover-color: var(--liwe3-${ name }-info-500-hover);
					--item-hover-bg: var(--liwe3-${ name }-info-700-hover);
					--list-background: var(--liwe3-${ name }-info);
				}
				.svelte-select.success {
					--background: var(--liwe3-${ name }-success);
					--border-radius: var(--liwe3-border-radius);
					--border: var(--liwe3-border-width) solid var(--liwe3-${ name }-success-200-border);
					--placeholder-color: var(--liwe3-${ name }-success-500-text);
					--item-color: var(--liwe3-${ name }-success-500-text);
					--item-hover-color: var(--liwe3-${ name }-success-500-hover);
					--item-hover-bg: var(--liwe3-${ name }-success-700-hover);
					--list-background: var(--liwe3-${ name }-success);
				}
				.svelte-select.warning {
					--background: var(--liwe3-${ name }-warning);
					--border-radius: var(--liwe3-border-radius);
					--border: var(--liwe3-border-width) solid var(--liwe3-${ name }-warning-200-border);
					--placeholder-color: var(--liwe3-${ name }-warning-500-text);
					--item-color: var(--liwe3-${ name }-warning-500-text);
					--item-hover-color: var(--liwe3-${ name }-warning-500-hover);
					--item-hover-bg: var(--liwe3-${ name }-warning-700-hover);
					--list-background: var(--liwe3-${ name }-warning);
				}
				.svelte-select.error {
					--background: var(--liwe3-${ name }-error);
					--border-radius: var(--liwe3-border-radius);
					--border: var(--liwe3-border-width) solid var(--liwe3-${ name }-error-200-border);
					--placeholder-color: var(--liwe3-${ name }-error-500-text);
					--item-color: var(--liwe3-${ name }-error-500-text);
					--item-hover-color: var(--liwe3-${ name }-error-500-hover);
					--item-hover-bg: var(--liwe3-${ name }-error-700-hover);
					--list-background: var(--liwe3-${ name }-error);
				}
				`;
		'\n}\n';
		// console.log( 'Inject colors', name, style.innerHTML );
	}

	if ( is_new ) document.head.appendChild( style );
};

type ThemeColorsDefinitions = Record<string, Record<string, string>>;

export const themeCreate = ( colorsDefinitions: ThemeColorsDefinitions ) => {
	let modes: any = {};
	let colors: Record<string, string> = {};

	Object.keys( colorsDefinitions ).forEach( ( name ) => {
		colors = colorsDefinitions[ name ];
		Object.entries( colors ).forEach( ( [ mode, col ] ) => {
			const values = rgbHexToInt( col );
			const mode_colors = calculateColors( `liwe3-${ name }-${ mode }`, values[ 0 ], values[ 1 ], values[ 2 ] );
			modes = { ...modes, ...mode_colors };
		} );

		injectColors( name, modes );
		modes = {};
	} );
};

export const themeCreateDefault = () => {
	const themeStore = get( theme );

	if ( browser ) {
		// check if the user has saved a theme in local storage
		const lightTheme = localStorage.getItem( `liwe3-light-theme` );
		if ( lightTheme ) themeSetModeColors( 'light', JSON.parse( lightTheme ) );

		const darkTheme = localStorage.getItem( `liwe3-dark-theme` );
		if ( darkTheme ) themeSetModeColors( 'dark', JSON.parse( darkTheme ) );

		const themeMode = localStorage.getItem( `liwe3-theme-mode` );
		themeSetMode( themeMode == 'dark' ? 'dark' : 'light' );
	}

	themeCreate( {
		light: themeStore.light,
		dark: themeStore.dark
	} );


};

export const themeSetMode = ( mode: 'light' | 'dark' ) => {
	if ( browser ) {
		// remove 'liwe3-dark|light-theme' class
		document.body.classList.remove( `liwe3-light-theme` );
		document.body.classList.remove( `liwe3-dark-theme` );

		document.body.classList.add( `liwe3-${ mode }-theme` );

		localStorage.setItem( `liwe3-theme-mode`, mode );

		themeModeSet( mode );
	}
};
