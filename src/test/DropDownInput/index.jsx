import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import styles from "./style.module.scss"

const checkErrors = (props) => {
    const { PrefixComponent, listData, RenderDropDown } = props
    if (!PrefixComponent) {
        throw Error("PrefixComponent required")
    }
    if (!RenderDropDown) {
        throw Error("RenderDropDown function required")
    }
    if (!Array.isArray(listData)) {
        throw Error(`DropDownComponents should be array of object with Unique key [{key:"key1",...rest}]`)
    } else {
        if (listData.length>0 && !listData[0].key) {
            throw Error("DropDownComponents array should consist of key field")
        }
    }
}

const isEmpty = val => val == undefined || val == null


export default function DropDownInput(props) {
    checkErrors(props)
    const { PrefixComponent, RenderDropDown, listData, showDropDown, showSearch = true, onBlur = () => { }, } = props

    const [searchForKey, setSearchForKey] = useState(null)
    const [inputFocused, setInputFocused] = useState(false)
    const inputRef = useRef(null)
    const labelRef = useRef(null)
    const dropDownRef = useRef(null)


    function onDropDownBlur(e) {
        if (dropDownRef.current &&  document.body.contains(e.target)) {
            if (!dropDownRef.current.contains(e.target)) {
                onBlur()
            }
        }
    }

    useEffect(() => {
        document.addEventListener("click", onDropDownBlur)
        return () => {
            document.removeEventListener("click", onDropDownBlur)
        }
    })


    // const onTransitionEnd = (e) => {
    //     if (inputFocused || props?.inputProps?.value) {
    //         labelRef.current?.classList?.add(styles["transition_end"])
    //     } else {
    //         labelRef.current?.classList?.remove(styles["transition_end"])
    //     }
    // }

    // const transitionEvents = ["transitionend", "webkitTransitionEnd", "oTransitionEnd", "otransitionend", "MSTransitionEnd"]


    // useEffect(() => {
    //     transitionEvents.forEach(type => {
    //         labelRef.current?.addEventListener("transitionend", onTransitionEnd);
    //     })

    //     return () => {
    //         transitionEvents.forEach(type => {
    //             labelRef.current?.removeEventListener("transitionend", onTransitionEnd);
    //         })
    //     }
    // })



    return (
        <div className={styles["dropdown-input-wrapper"]}>
            <div className={`${styles["group-input"]} ${inputFocused ? styles["group-input-focused"] : ""}`}>
                <div className={styles["prefix-wrapper"]}>
                    <PrefixComponent />
                </div>
                <div className={`${styles["input-wrapper"]}`}>
                    {
                        props?.label ?
                            <div
                                className={`${styles["input-label"]} ${inputFocused || !!props?.inputProps?.value ? styles["move-input-label"] : ""}`}
                                onClick={e => {
                                    inputRef?.current?.focus()
                                }}
                                ref={labelRef}
                            >
                                <div className={styles["label-bg"]}>
                                    {props.label}
                                </div>
                            </div> : <></>
                    }
                    <input
                        className={styles["input"]}
                        type="text"
                        {...props.inputProps}
                        onFocus={(e) => {
                            setInputFocused(true)
                            props?.inputProps?.onFocus && props?.inputProps?.onFocus(e)
                        }}
                        onBlur={(e) => {
                            setInputFocused(false)
                            props?.inputProps?.onBlur && props?.inputProps?.onBlur(e)
                        }}
                        ref={(currentRef) => {
                            inputRef.current = currentRef;
                            if (props?.inputProps?.ref?.current) {
                                props.inputProps.ref.current = currentRef;
                            }
                        }}
                    />
                </div>
            </div>
            <div className={`${styles["dropdown-group-wrap"]}  ${showDropDown ? styles["dropdown-group-wrap-visible"] : ""}`}  ref={dropDownRef}>
                <div className={`${styles["dropdown-group"]}`}>
                    {
                        showSearch ?
                            <div className={styles["search-input-group"]}>
                                <div className={styles["search-input-prefix"]}>
                                    Icon
                                </div>
                                <div className={styles["search-input-wrapper"]}>
                                    <input
                                        className={styles["search-input"]}
                                        type="text"
                                        {...props?.searchInputProps}
                                        value={searchForKey}
                                        onChange={e =>{
                                            setSearchForKey(e.currentTarget.value)
                                            props?.searchInputProps?.onChange && props?.searchInputProps?.onChange(e)
                                        }}
                                    />
                                </div>
                            </div>
                            : <></>
                    }
                    <div className={`${styles["dropdown"]}`}>
                        {
                            listData
                                .filter(({key}) =>{
                                    return key+""?.includes(searchForKey+"")
                                })
                                .map(item => {
                                    return <div className={styles["dropdown-item"]}>
                                        <RenderDropDown item={item} />
                                    </div>
                                })
                        }
                    </div>

                </div>
            </div>

        </div>
    )
}
