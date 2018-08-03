import React from "react";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  //~~~~~MAIN CONTAINERS~~~~~
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCFCFB",
    position: "absolute"
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1%"
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22
  },

  //~~~~~SUB CONTAINERS~~~~~
  inboxChatArea: {
    flex: 2,
    width: "80%",
    height: "90%",
    borderColor: "#000",
    borderRadius: 4,
    borderWidth: 1,
    marginVertical: 10
  },
  listUsersArea: {
    flex: 4,
    width: "90%",
    maxHeight: "85%",
    borderRadius: 3,
    borderWidth: 1
  },
  generatedChatMessages: {
    minWidth: "100%",
    minHeight: "45%",
    fontSize: 20,
    margin: 3
  },
  chatBoxArea: {
    flex: 9,
    width: "91%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginVertical: "2%"
  },
  textInput: {
    width: 250,
    minHeight: 40,
    maxHeight: 40,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },

  //~~~~~SECTIONS~~~~~
  largeSection: {
    flex: 1,
    flexDirection: "row",
    width: "90%",
    height: "48%",
    alignItems: "center",
    justifyContent: "center"
  },
  smallSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  smallSectionRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  //~~~~~BUTTONS~~~~~
  menuButton: {
    width: 115,
    minHeight: 39,
    maxHeight: 39,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFA500",
    borderRadius: 3,
    borderWidth: 1,
    marginHorizontal: "2%"
  },
  largePurpleButton: {
    width: 250,
    minHeight: 40,
    maxHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#841584",
    borderColor: "#000",
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 10
  },
  largeOrangeButton: {
    width: 250,
    minHeight: 40,
    maxHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFA500",
    borderColor: "#000",
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 10
  },
  smallPurpleButton: {
    width: "21%",
    minHeight: 39,
    maxHeight: 39,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#841584",
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 10
  },
  smallRedButton: {
    width: "21%",
    minHeight: 39,
    maxHeight: 39,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    borderRadius: 4,
    borderWidth: 1,
    marginLeft: "3%",
    paddingHorizontal: 5
  },

  //~~~~~TEXT~~~~~
  blockButtonText: {
    alignItems: "center",
    justifyContent: "center",
    textAlignVertical: "center",
    fontSize: 20
  },
  loginStatusNotification: {
    flex: 1,
    width: 200,
    alignItems: "center",
    justifyContent: "flex-end",
    margin: 1,
    marginBottom: "14%"
  },
  warningText: {
    textAlign: "center",
    color: "red",
    fontSize: 20,
    minHeight: 30
  },
  notableOrangeText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "#FFA500",
    fontSize: 20,
    paddingVertical: 6
  },
  notableBlackText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "#000",
    fontSize: 20,
    marginTop: "1%",
    paddingVertical: 6
  },
  blackText: {
    fontSize: 20,
    justifyContent: "center"
  },
  orangeText: {
    color: "#FFA500",
    fontSize: 20
  },
  purpleText: {
    color: "#841584",
    fontSize: 20
  }
});
