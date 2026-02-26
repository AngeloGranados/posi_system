import { useState } from "react";

export default function useAlert() {
    const [showAlert, setShowAlert] = useState<boolean> (false)
    const [alertTitle, setAlertTitle] = useState<string>("")
    const [alertMessage, setAlertMessage] = useState<string>("")
    const [alertVariant, setAlertVariant] = useState<"success" | "warning" | "error">("success")

    function triggerAlert(title: string, message: string, variant: "success" | "warning" | "error") {
        setAlertTitle(title)
        setAlertMessage(message)
        setAlertVariant(variant)
        setShowAlert(true)
    }

    function closeAlert() {
        setShowAlert(false)
        setAlertTitle("")
        setAlertMessage("")
        setAlertVariant("success")
    }

    return {
        showAlert,
        alertTitle,
        alertMessage,
        alertVariant,
        triggerAlert,
        closeAlert,
    }
}