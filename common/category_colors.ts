import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  orange,
  pink,
  purple,
  red,
  teal,
} from '@mui/material/colors'

import type { CategoryCode, GradientColorsLightDark } from '@/types'

export const CATEGORY_COLORS: Record<CategoryCode, GradientColorsLightDark> = {
  INC: {
    light: { start: green[700], end: green[300] },
    dark: { start: green[900], end: green[400] },
  },
  HOU: {
    light: { start: blue[700], end: blue[300] },
    dark: { start: blue[900], end: blue[400] },
  },
  GRO: {
    light: { start: lightGreen[700], end: lightGreen[300] },
    dark: { start: lightGreen[900], end: lightGreen[400] },
  },
  EAT: {
    light: { start: orange[700], end: orange[300] },
    dark: { start: orange[900], end: orange[400] },
  },
  TRN: {
    light: { start: indigo[700], end: indigo[300] },
    dark: { start: indigo[900], end: indigo[400] },
  },
  TRV: {
    light: { start: cyan[700], end: cyan[300] },
    dark: { start: cyan[900], end: cyan[400] },
  },
  SHP: {
    light: { start: pink[700], end: pink[300] },
    dark: { start: pink[900], end: pink[400] },
  },
  HLT: {
    light: { start: red[700], end: red[300] },
    dark: { start: red[900], end: red[400] },
  },
  EDU: {
    light: { start: deepPurple[700], end: deepPurple[300] },
    dark: { start: deepPurple[900], end: deepPurple[400] },
  },
  ENT: {
    light: { start: purple[700], end: purple[300] },
    dark: { start: purple[900], end: purple[400] },
  },
  COM: {
    light: { start: lightBlue[700], end: lightBlue[300] },
    dark: { start: lightBlue[900], end: lightBlue[400] },
  },
  FIN: {
    light: { start: blueGrey[700], end: blueGrey[300] },
    dark: { start: blueGrey[900], end: blueGrey[400] },
  },
  FAM: {
    light: { start: amber[700], end: amber[300] },
    dark: { start: amber[900], end: amber[400] },
  },
  GOV: {
    light: { start: brown[700], end: brown[300] },
    dark: { start: brown[900], end: brown[400] },
  },
  SOC: {
    light: { start: teal[700], end: teal[300] },
    dark: { start: teal[900], end: teal[400] },
  },
  TFR: {
    light: { start: grey[700], end: grey[300] },
    dark: { start: grey[800], end: grey[400] },
  },
}
