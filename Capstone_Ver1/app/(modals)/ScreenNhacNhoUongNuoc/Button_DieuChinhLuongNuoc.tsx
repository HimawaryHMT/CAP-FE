import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';

type Props = {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  waterAmount: number;
  setWaterAmount: (value: number) => void | Promise<void>;
};

const Button_DieuChinhLuongNuoc = ({
  modalVisible,
  setModalVisible,
  waterAmount,
  setWaterAmount,
}: Props) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Kích thước chai của bạn</Text>

          {/* Unit Selector */}
          <View style={styles.unitSwitch}>
            <Text style={[styles.unitText, styles.unitMlActive]}>ml</Text>
            <Text style={[styles.unitText, styles.unitTextDisabled]}>oz</Text>
          </View>

          {/* Water Amount */}
          <Text style={styles.waterAmountText}>{waterAmount} ml</Text>

          {/* Slider with Marks */}
          <View style={styles.sliderContainer}>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={100}
              maximumValue={500}
              step={50}
              value={waterAmount}
              onValueChange={setWaterAmount}
              minimumTrackTintColor="#0b4d40"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#0b4d40"
            />
            <View style={styles.sliderMarks}>
              {[100, 200, 300, 400, 500].map((v, idx) => (
                <View key={idx} style={styles.markContainer}>
                  <View style={styles.markLine} />
                  <Text style={styles.markText}>{v}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Confirm Button */}
          <Pressable
            style={styles.confirmBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.confirmText}>ĐƯỢC RỒI</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Button_DieuChinhLuongNuoc;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 15,
  },
  unitSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  unitMlActive: {
    color: '#0b4d40',
    borderBottomWidth: 2,
    borderColor: '#0b4d40',
  },
  unitTextDisabled: {
    color: '#aaa',
  },
  waterAmountText: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    color: '#0b4d40',
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  sliderMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -10,
  },
  markContainer: {
    alignItems: 'center',
  },
  markLine: {
    width: 2,
    height: 10,
    backgroundColor: '#0b4d40',
    marginBottom: 2,
  },
  markText: {
    fontSize: 12,
    color: '#0f172a',
  },
  confirmBtn: {
    backgroundColor: '#0b4d40',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
