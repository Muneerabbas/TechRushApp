import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Modal, 
    TouchableOpacity, 
    FlatList, 
    ActivityIndicator, 
    Alert, 
    Image,
    KeyboardAvoidingView,
    Platform,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../assets/utils/colors';
import { getGroupActivity, settlePayment } from '../(tabs)/services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_STORAGE_KEY = 'userSecurityPIN';

// --- Reusable Payment Modal for Settling Bills ---
const SettlePaymentModal = ({ isVisible, bill, onClose, onSuccess }) => {
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSettlePayment = useCallback(async () => {
        if (!pin.trim() || pin.length !== 4) {
            setError("Please enter a valid 4-digit PIN.");
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
            if (!storedPin) {
                Alert.alert("PIN Not Set", "Please set up a security PIN in your profile first.");
                setIsLoading(false);
                onClose();
                return;
            }

            if (pin !== storedPin) {
                setError("Incorrect PIN. Please try again.");
                setPin("");
                setIsLoading(false);
                return;
            }

            await settlePayment(bill._id);
            Alert.alert("Success!", "Your payment has been settled.");
            onSuccess();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to settle payment.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [bill, pin, onClose, onSuccess]);

    // Reset state when modal is closed
    useEffect(() => {
        if (!isVisible) {
            setPin("");
            setError("");
            setIsLoading(false);
        }
    }, [isVisible]);

    return (
        <Modal transparent={true} visible={isVisible} animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.paymentModalOverlay}>
                <View style={styles.paymentModalContainer}>
                    <Image source={require('../assets/images/payment.png')} style={styles.paymentImage} />
                    <Text style={styles.paymentTitle}>Confirm Settlement</Text>
                    <Text style={styles.paymentAmountText}>
                        You are paying <Text style={{ fontFamily: 'Poppins-Bold' }}>₹{bill?.amount?.toFixed(2)}</Text>
                    </Text>
                    <Text style={styles.paymentSubtitle}>Enter your 4-digit PIN to confirm</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TextInput
                        style={styles.pinInput}
                        placeholder="••••"
                        secureTextEntry={true}
                        keyboardType="number-pad"
                        value={pin}
                        onChangeText={setPin}
                        maxLength={4}
                        placeholderTextColor="#bbb"
                    />
                    
                    <TouchableOpacity
                        style={[styles.payButton, (isLoading || pin.length !== 4) && styles.payButtonDisabled]}
                        onPress={handleSettlePayment}
                        disabled={isLoading || pin.length !== 4}
                    >
                        {isLoading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.payText}>Settle Payment</Text>}
                    </TouchableOpacity>
            
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};


const BillItem = ({ bill, onSettle, currentUserID }) => {
    const paidCount = bill.splits.filter(s => s.paid).length;
    const totalCount = bill.splits.length;
    const progress = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;
    
    const userSplit = bill.splits.find(s => s.user._id === currentUserID);

    return (
        <View style={styles.billContainer}>
            <View style={styles.billHeader}>
                <Text style={styles.billDescription}>{bill.description}</Text>
                <Text style={styles.billAmount}>Total: ₹{bill.totalAmount.toFixed(2)}</Text>
            </View>
            <Text style={styles.creatorText}>Created by: {bill.creator.name}</Text>
            
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarForeground, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.paymentStatus}>{bill.paymentStatus}</Text>

            {userSplit && (
                <View style={styles.userShareContainer}>
                    <View>
                        <Text style={styles.yourShareLabel}>Your Share</Text>
                        <Text style={styles.yourShareAmount}>₹{userSplit.amount.toFixed(2)}</Text>
                    </View>
                    {userSplit.paid ? (
                        <View style={styles.paidBadge}>
                            <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                            <Text style={styles.paidText}>Paid</Text>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.settleButton} onPress={() => onSettle(bill)}>
                            <Text style={styles.settleButtonText}>Settle Now</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

export const GroupDetailModal = ({ isVisible, group, onClose }) => {
    const [activity, setActivity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserID, setCurrentUserID] = useState(null);
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const fetchActivityAndUser = async () => {
        if (group) {
            setIsLoading(true);
            try {
                const userID = await AsyncStorage.getItem('userID');
                setCurrentUserID(userID);
                const data = await getGroupActivity(group._id);
                setActivity(data);
            } catch (error) {
                Alert.alert("Error", "Could not fetch group activity.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (isVisible) {
            fetchActivityAndUser();
        }
    }, [group, isVisible]);

    const handleSettlePress = (bill) => {
        const userSplit = bill.splits.find(s => s.user._id === currentUserID);
        setSelectedBill({ _id: bill._id, amount: userSplit.amount });
        setPaymentModalVisible(true);
    };

    const handleSuccessfulSettlement = () => {
        setPaymentModalVisible(false);
        setSelectedBill(null);
        fetchActivityAndUser(); 
    };

    return (
        <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#555" />
                    </TouchableOpacity>
                    
                    <Image source={require('../assets/images/share.png')} style={styles.modalImage} />

                    <Text style={styles.groupTitle}>{group?.name}</Text>
                    
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <FlatList
                            data={activity?.bills}
                            renderItem={({ item }) => <BillItem bill={item} onSettle={handleSettlePress} currentUserID={currentUserID} />}
                            keyExtractor={(item) => item._id}
                            ListEmptyComponent={<Text style={styles.noBillsText}>No bills in this group yet.</Text>}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>
            {selectedBill && (
                <SettlePaymentModal 
                    isVisible={isPaymentModalVisible}
                    bill={selectedBill}
                    onClose={() => setPaymentModalVisible(false)}
                    onSuccess={handleSuccessfulSettlement}
                />
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.4)' 
    },
    modalContainer: {
        backgroundColor: 'white', 
        borderRadius: 20,
        padding: 20, 
        width: '90%',
        maxHeight: '80%',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    closeButton: { 
        alignSelf: 'flex-end', 
        padding: 5,
    },
    modalImage: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 15,
    },
    groupTitle: { 
        fontSize: 22, 
        fontFamily: 'Poppins-Bold', 
        color: colors.text, 
        marginBottom: 20,
        textAlign: 'center',
    },
    billContainer: {
        backgroundColor: '#F8F9FA', 
        borderRadius: 15, 
        padding: 15, 
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    billHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    billDescription: { 
        fontSize: 16, 
        fontFamily: 'Poppins-SemiBold', 
        color: colors.text,
        flex: 1,
    },
    billAmount: { 
        fontSize: 14, 
        fontFamily: 'Poppins-Bold', 
        color: colors.text,
    },
    creatorText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: colors.textSecondary,
        marginTop: 4,
        marginBottom: 10,
    },
    progressBarBackground: {
        height: 8, 
        backgroundColor: '#e0e0e0', 
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarForeground: { 
        height: '100%', 
        backgroundColor: colors.primary, 
        borderRadius: 4 
    },
    paymentStatus: { 
        fontSize: 12, 
        fontFamily: 'Poppins-Regular', 
        color: '#888', 
        marginTop: 5, 
        alignSelf: 'flex-end' 
    },
    userShareContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        marginTop: 15,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    yourShareLabel: {
        fontFamily: 'Poppins-Regular',
        color: colors.textSecondary,
        fontSize: 14,
    },
    yourShareAmount: {
        fontFamily: 'Poppins-Bold',
        color: colors.text,
        fontSize: 16,
    },
    settleButton: {
        backgroundColor: colors.secondary, 
        borderRadius: 10, 
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    settleButtonText: { 
        color: colors.text, 
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
    },
    paidBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    paidText: {
        color: '#2E7D32',
        fontFamily: 'Poppins-Bold',
        marginLeft: 5,
    },
    noBillsText: { 
        textAlign: 'center', 
        fontFamily: 'Poppins-Regular', 
        color: '#999', 
        marginTop: 50 
    },
    // Payment Modal Styles
    paymentModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    paymentModalContainer: {
        width: "90%",
        maxWidth: 400,
        padding: 25,
        backgroundColor: colors.white,
        borderRadius: 20,
        alignItems: "center",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    paymentImage: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    paymentTitle: {
        fontSize: 22,
        fontFamily: "Poppins-Bold",
        color: "#333",
        textAlign: "center",
    },
    paymentAmountText: {
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        color: '#444',
        marginTop: 5,
        marginBottom: 10,
    },
    paymentSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        fontFamily: "Poppins-Regular",
        fontSize: 14,
        marginBottom: 15,
        textAlign: "center",
    },
    pinInput: {
        fontSize: 28,
        fontFamily: "Poppins-Bold",
        textAlign: "center",
        letterSpacing: 20,
        width: "80%",
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        paddingVertical: 12,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    payButton: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    payButtonDisabled: {
        backgroundColor: "#a0c4ff",
        shadowOpacity: 0,
    },
    payText: {
        color: colors.white,
        fontFamily: "Poppins-SemiBold",
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 15,
    },
    cancelText: {
        color: "#777",
        fontFamily: "Poppins-Regular",
        fontSize: 14,
    },
});
