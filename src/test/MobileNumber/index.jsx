import React, { useState } from 'react'
import DropDownInput from '../DropDownInput'
import styles from "./style.module.scss"

export default function MobileInput() {

    const [mobileNumber, setMobileNumber] = useState("")
    const [showDropDown, setShowDropDown] = useState(false)
    return (
        <div style={{ width: "300px", padding: "20px 20px" }}>

            <DropDownInput
                PrefixComponent={() => <b onClick={e=>setShowDropDown(true)}>label</b>}
                RenderDropDown={({ item }) => {
                    return <div>{item.key}</div>
                }}

                inputProps={{
                    onChange: e => setMobileNumber(e.target.value),
                    value:mobileNumber,
                }}
                searchInputProps={{
                    placeHolder:"Search Country"
                }}


                listData={[
                    { key: 1, },
                    { key: 2, },
                    { key: 3, },
                    { key: 4, },
                ]}
                label="Mobile No"
                showDropDown={showDropDown}
                onBlur={e=>setShowDropDown(false)}

            />
        </div>
    )
}
