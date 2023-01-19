import React, { useState } from 'react'
import DropDownInput from '../DropDownInput'
import styles from "./style.module.scss"

export default function MobileInput() {

    const [mobileNumber, setMobileNumber] = useState("")
    const [showDropDown, setShowDropDown] = useState(false)
    const [selectedDropDown, setSelectedDropDown] = useState(null)

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
                    placeholder:"Search Country"
                }}


                listData={[ ...Array(40).keys() ].map( i => i+1).map(i=>({key:i}))}
                label="Mobile No"
                showDropDown={showDropDown}
                onBlur={e=>setShowDropDown(false)}
                onDropDownChange={e=>setSelectedDropDown(e)}
                selectedDropDown={selectedDropDown}

            />
        </div>
    )
}
