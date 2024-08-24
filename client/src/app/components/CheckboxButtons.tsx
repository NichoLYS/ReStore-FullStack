import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
    items: string[];
    checked?: string[];
    onChange: (items: string[]) => void;
    // resetParams: () => void;
}

export default function CheckboxButtons({items, checked, onChange}: Props) {
    const [checkedItems, setCheckedItems] = useState(checked || []);

    function handleChecked(value: string) {
        const currentIndex = checkedItems.findIndex(item => item === value);
        let newChecked: string[] = [];
        //memasukkan value yang belum dicheck ke array newChecked
        if(currentIndex === -1) 
            {
                newChecked = [...checkedItems, value];
                setCheckedItems(newChecked);
                onChange(newChecked);
            }
        //mengembalikan item2 yang dicheck yang tidak sama dengan value yang diberikan
        //yang berarti value tersebut dihapus atau diuncheck
        else {
            newChecked = checkedItems.filter(item => item !== value);
            setCheckedItems(newChecked);
            onChange(newChecked);
        }

    }
    return (
        <FormGroup>
            {items.map(item => (
                <FormControlLabel 
                onClick={() => handleChecked(item)}
                control={<Checkbox checked={checkedItems.indexOf(item) !== -1} 
                />} 
                label={item} 
                key={item} />
            ))}
        </FormGroup>
    )
}