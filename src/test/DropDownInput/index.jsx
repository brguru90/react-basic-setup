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
        if (listData.length > 0 && !listData[0].key) {
            throw Error("DropDownComponents array should consist of key field")
        }
    }
}

const isEmpty = val => val == undefined || val == null


export default function DropDownInput(props) {
    checkErrors(props)
    const { PrefixComponent, RenderDropDown, listData, selectedDropDown, showDropDown, showSearch = true, onBlur = () => { }, onDropDownChange = () => { }, } = props

    const [searchForKey, setSearchForKey] = useState("")
    const [inputFocused, setInputFocused] = useState(false)
    const inputRef = useRef(null)
    const labelRef = useRef(null)
    const dropDownGroupRef = useRef(null)
    const dropDownRef = useRef(null)
    const dropDownItemsRef = useRef([]);
    const [dropDownHeight, setDropDownHeight] = useState(null)


    function onDropDownBlur(e) {
        if (dropDownGroupRef.current && document.body.contains(e.target)) {
            if (!dropDownGroupRef.current.contains(e.target)) {
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



    const scrollIntoSelected = (toIndex) => {
        // if (dropDownItemsRef.current?.length && !isEmpty(i) && showDropDown) {
        //     dropDownItemsRef.current[i].scrollIntoView({ behavior: "smooth", block: "start" })
        // }
        if (!isEmpty(toIndex) && dropDownRef.current) {

            let height = 0;
            for (let i = 0; i < toIndex && i < dropDownItemsRef.current?.length; i++) {
                height +=( dropDownItemsRef.current[i]?.offsetHeight || 0)
            }
            dropDownRef.current.scrollTop = height
        }
    }



    useEffect(() => {
        if (isEmpty(selectedDropDown?.i) && listData.length > 0) {
            onDropDownChange({ ...listData[0], i: 0 })
        }

        if (dropDownItemsRef.current?.length) {
            let maxVisibleElements = 8;
            if (props.maxVisibleElements != undefined && props.maxVisibleElements != null) {
                maxVisibleElements = props.maxVisibleElements
            }
            if (maxVisibleElements) {
                let height = 0; // to include padding
                const maxItem = listData?.length >= maxVisibleElements ? maxVisibleElements : listData?.length;
                for (let i = 0; i < maxItem && dropDownItemsRef.current?.length >= maxItem; i++) {
                    height += dropDownItemsRef.current[i]?.offsetHeight || 0
                }
                if (listData?.length >= maxVisibleElements) {
                    height -= (dropDownItemsRef.current[maxItem - 1]?.offsetHeight || 0) / 2
                }
                if (height > 2) {
                    setDropDownHeight(height)
                }
            }
        }

        scrollIntoSelected(selectedDropDown?.i)
        // return () => {
        //     scrollIntoSelected(0)
        // }

    }, [listData])


    const onTransitionEnd = (e) => {
        scrollIntoSelected(selectedDropDown?.i)
        if (showDropDown) {
            dropDownGroupRef.current?.classList?.add(styles["transition_end"])
        } else {
            dropDownGroupRef.current?.classList?.remove(styles["transition_end"])
        }
    }

    const transitionEvents = ["transitionend", "webkitTransitionEnd", "oTransitionEnd", "otransitionend", "MSTransitionEnd"]


    useEffect(() => {
        transitionEvents.forEach(type => {
            dropDownGroupRef.current?.addEventListener("transitionend", onTransitionEnd);
        })

        if(!showDropDown){
            dropDownGroupRef.current?.classList?.remove(styles["transition_end"])
        }

        return () => {
            transitionEvents.forEach(type => {
                dropDownGroupRef.current?.removeEventListener("transitionend", onTransitionEnd);
            })
        }
    }, [showDropDown])



    return (
        <div className={styles["dropdown-input-wrapper"]}>
            <div className={`${styles["group-input"]} ${inputFocused || showDropDown ? styles["group-input-focused"] : ""}`}>
                <div className={styles["prefix-wrapper"]}>
                    <PrefixComponent />
                </div>
                <div className={`${styles["input-wrapper"]}`}>
                    {
                        props?.label ?
                            <div
                                className={`${styles["input-label"]} ${inputFocused || showDropDown || !!props?.inputProps?.value ? styles["move-input-label"] : ""}`}
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
            <div className={`${styles["dropdown-group-wrap"]}  ${showDropDown ? styles["dropdown-group-wrap-visible"] : ""}`} ref={dropDownGroupRef}>
                <div className={`${styles["dropdown-group"]}`}>
                    {
                        showSearch ?
                            <div className={styles["search-input-group"]}>
                                <div className={`${styles["search-input-prefix"]} icon-search search-icon-color`}>
                                </div>
                                <div className={styles["search-input-wrapper"]}>
                                    <input
                                        className={styles["search-input"]}
                                        type="text"
                                        {...props?.searchInputProps}
                                        value={searchForKey}
                                        onChange={e => {
                                            setSearchForKey(e.currentTarget.value)
                                            props?.searchInputProps?.onChange && props?.searchInputProps?.onChange(e)
                                        }}
                                    />
                                </div>
                            </div>
                            : <></>
                    }
                    <div className={`${styles["dropdown"]}`} style={{ height: `${dropDownHeight}px` }} ref={dropDownRef}>
                        {
                            listData
                                .filter(({ searchKey,key }) => {
                                    return isEmpty(searchForKey) || ((searchKey || key) + "").toLowerCase().includes((searchForKey + "").toLowerCase())
                                })
                                .map((item, i) => {
                                    return <div className={styles["dropdown-item"]} key={item?.key} ref={r => dropDownItemsRef.current[i] = r} onClick={e => {
                                        onDropDownChange({ ...item, i })
                                        onBlur()
                                    }}>
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