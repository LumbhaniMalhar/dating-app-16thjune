import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';

const TermsDialog = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.header}>Terms of Service</Text>
        <Text style={styles.subHeader}>Last updated on 5/12/2022</Text>
        <ScrollView style={styles.content}>
          <Text style={styles.clause}>Clause 1</Text>
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivarra condimentum eget purus in. Consectetur eget id morbi amet amet, in, ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
          </Text>
          <Text style={styles.clause}>Clause 2</Text>
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivarra condimentum eget purus in. Consectetur eget id morbi amet amet, in, ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
          </Text>
          <Text style={styles.clause}>Clause 3</Text>
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivarra condimentum eget purus in. Consectetur eget id morbi amet amet, in, ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
          </Text>
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Scroll to Top</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  header: {
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 12,
    color: Colors.light.text,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  clause: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TermsDialog;