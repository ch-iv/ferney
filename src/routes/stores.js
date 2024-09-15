import {writable} from "svelte/store";
import {defaultState} from "./state.js";

export const transcribedTextStore = writable('')
export const appStateStore = writable(defaultState)
