import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'

const AppFrom = ({validationSchema,onSubmit,initialValues,children}) => {
  return (
    <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            >
                {
                    ()=>(<>
                    
                    {children}
                    </>)
                }
            </Formik>
  )
}

export default AppFrom

const styles = StyleSheet.create({})