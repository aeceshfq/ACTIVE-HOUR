import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material';
import { common } from '@mui/material/colors';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name, theme, renderName, style, digits) {
    var val = `${name[0]}`;
    if (digits) {
      try {
        val = `${name?.split(' ')?.[0]?.[0]}${name?.split(' ')?.[1]?.[0]??''}`;
      } catch (error) {
          
      }  
    }
    try {
      val = val.toUpperCase();
    } catch (error) {
      
    }
    let sx = {
      bgcolor: renderName?stringToColor(name):theme.palette.primary.main,
      color: renderName?common.white:null
    };
    if (typeof style === "object" && style) {
      sx = {
        ...style,
        ...sx
      }
    }
    return {
        sx: sx,
        children: val,
    };
}

export default function CustomAvatar({name, icon}) {
  const theme = useTheme();
  return (
    <Avatar {...stringAvatar(name, theme)}>{icon}</Avatar>
  );
}

export function NameAvatar({name, sx, digits}) {
  const theme = useTheme();
  return (
    <Avatar {...stringAvatar(name, theme, true, sx, digits)}></Avatar>
  );
}