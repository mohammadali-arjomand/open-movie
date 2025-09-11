import { useThemeColor } from "@/hooks/useThemeColor"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Modal, Portal } from "react-native-paper"
type Item = {
    label: string,
    value: string
}

export default function DropOption({label, options, value, onSelect}: {label: string, options: Item[], value: string, onSelect: (value: string) => void}) {
    const [selectedItem, setSelectedItem] = useState<string>("")

    const styles = StyleSheet.create({
        modal: {backgroundColor: useThemeColor("background2"), padding: 20, margin: 20, borderRadius: 8},
    })

    const primary = useThemeColor("primary")
    const text = useThemeColor("text")

    return (
        <View>

            <TouchableOpacity onPress={() => setSelectedItem(label)} style={{borderColor: useThemeColor("border"), borderBottomWidth: 0.5, paddingVertical: 20, paddingHorizontal: 8}}>
                <Text style={{color: useThemeColor("text"), fontSize: 25}}>{label}</Text>
            </TouchableOpacity>

            <Portal>
                <Modal  contentContainerStyle={styles.modal} visible={selectedItem === label} onDismiss={() => setSelectedItem("")}>
                    <ScrollView>
                        {options.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => onSelect(item.value)}>
                                <Text style={{color: value == item.value ? primary : text, paddingVertical: 16, borderBottomWidth: 0.5, borderColor: useThemeColor("border")}}>
                                    {value === item.value ? <Ionicons size={12} name="checkmark"/> : null} {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Modal>
            </Portal>
        </View>
    )
}