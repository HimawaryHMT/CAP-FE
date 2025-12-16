// TopAddRecord.tsx
import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';


interface TopAddRecordProps {
    weight: string;
    setWeight: (value: string) => void;
    height: string;
    setHeight: (value: string) => void;
    bmi: number;
}

export default function TopAddRecord({ weight, setWeight, height, setHeight, bmi }: TopAddRecordProps) {

    // Xác định phân loại BMI
    const getBMICategory = () => {
        if (bmi < 16) return { name: "Gầy độ III", color: "#7c3aed", position: 0 };
        if (bmi < 17) return { name: "Gầy độ II", color: "#3b82f6", position: 1 };
        if (bmi < 18.5) return { name: "Gầy độ I", color: "#06b6d4", position: 2 };
        if (bmi < 25) return { name: "Bình thường", color: "#10b981", position: 3 };
        if (bmi < 30) return { name: "Thừa cân", color: "#fbbf24", position: 4 };
        if (bmi < 35) return { name: "Béo phì độ I", color: "#f97316", position: 5 };
        if (bmi < 40) return { name: "Béo phì độ II", color: "#ef4444", position: 6 };
        return { name: "Béo phì độ III", color: "#dc2626", position: 7 };
    };

    const category = getBMICategory();

    return (
        <View style={styles.infoCard}>
            {/* Cân nặng & Chiều cao */}
            <View style={styles.inputRow}>
                {/* Cân nặng */}
                <View style={styles.inputBox}>
                    <View style={styles.inputValueBox}>
                        <TextInput
                            style={[styles.inputValue , {textAlign: 'center' }]}
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                        />
                        <Pressable style={styles.editIcon}>
                            <Feather name="edit-3" size={30} color="#000000ff" />
                        </Pressable>
                    </View>
                    <Text style={styles.inputLabel}>Cân nặng (Kg)</Text>
                </View>

                {/* Chiều cao */}
                <View style={styles.inputBox}>
                    <View style={styles.inputValueBox}>
                        <TextInput
                            style={[styles.inputValue , {textAlign: 'center'}]}
                            value={height}
                            onChangeText={setHeight}
                            keyboardType="numeric"
                        />
                        <Pressable style={styles.editIcon}>
                            <FontAwesome name="edit" size={30} color="black" />
                        </Pressable>
                    </View>
                    <Text style={styles.inputLabel}>Chiều cao (Cm)</Text>
                </View>
            </View>

            {/* BMI Section */}
            <View style={styles.bmiSection}>
                <Text style={styles.bmiTitle}>{category.name} ⓘ</Text>
                <Text style={styles.bmiRange}>BMI: {bmi.toFixed(1)}</Text>

                {/* Color Scale */}
                <View style={styles.colorScale}>
                    {[
                        "#7c3aed",
                        "#3b82f6",
                        "#06b6d4",
                        "#10b981",
                        "#fbbf24",
                        "#f97316",
                        "#ef4444",
                        "#dc2626",
                    ].map((color, idx) => (
                        <View key={idx} style={styles.colorBarWrapper}>
                            <View style={[styles.colorBar, { backgroundColor: color }]} />
                            {idx === category.position && (
                                <Text style={styles.indicatorArrow}>▲</Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* Gender & Age */}
                <View style={styles.genderAge}>
                    <Text style={styles.genderIcon}>👤</Text>
                    <Text style={styles.genderText}>Nam giới | Tuổi: ??</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    inputRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    inputBox: {
        flex: 1,
    },
    inputValueBox: {
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap : 0,
        marginBottom: 6,
    },
    inputValue: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        flex: 1,
    },
    editIcon: {
        padding: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    inputLabel: {
        fontSize: 18,
        color: "#6b7280",
        fontWeight: "600",
        textAlign: "center",
    },
    bmiSection: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        gap: 12,
    },
    bmiTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
    },
    bmiRange: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
    },
    colorScale: {
        flexDirection: "row",
        gap: 4,
        paddingHorizontal: 12,
    },
    colorBarWrapper: {
        flex: 1,
        alignItems: "center",
    },
    colorBar: {
        height: 20,
        borderRadius: 10,
        width: "100%",
    },
    indicatorArrow: {
        fontSize: 14,
        color: "#111827",
        marginTop: 2,
    },
    genderAge: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    genderIcon: {
        fontSize: 16,
    },
    genderText: {
        fontSize: 14,
        color: "#111827",
        fontWeight: "600",
    },
});
