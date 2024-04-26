import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import privileges from '../privileges';

export default function PermissionSelections({ 
  onSelection = () => {},
  selected = [],
  readOnly = false
}) {
  const [selectedPermissions, setSelectedPermissions] = React.useState(selected);
  const handleToggle = (value) => () => {
    if(!readOnly){
      const currentIndex = selectedPermissions.indexOf(value);
      const newChecked = [...selectedPermissions];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setSelectedPermissions(newChecked);
      onSelection(newChecked);
    }
  };

  React.useEffect(() => {
    setSelectedPermissions(selected);
  }, [selected]);

  return (
    <List
      sx={{
        bgcolor: 'background.paper',
        maxHeight: 400,
        overflow: "auto"
      }}
      dense
      component="div"
      role="list"
    >
      {Object.values(privileges).map((value) => {
        const labelId = `transfer-list-all-item-${value}-label`;
        return (
          <ListItem
            disablePadding
            key={value}
            role="listitem"
            onClick={handleToggle(value)}
          >
            <ListItemIcon>
              <Checkbox
                  disabled={readOnly}
                  checked={selectedPermissions.indexOf(value) > -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value} />
          </ListItem>
        );
      })}
    </List>
  );
}
