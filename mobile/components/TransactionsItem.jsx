import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../assets/styles/home.styles";

export  const TransactionsItem = ({ item, onDelete }) => {
  const CATEGEORY_ICONS = {
    Food: "fast-food",
    Transport: "car",
    Shopping: "cart",
    Entertainment: "game-controller",
    Bills: "receipt",
    Health: "heart",
    Income: "cash",
    Other: "ellipsis-horizontal"
  };
  const isIncome = parseFloat(item.amount) > 0;
  
  return (
    <View style={styles.transactionCard} key={item.id}>
      <TouchableOpacity style={styles.transactionContent}>
        <View style={styles.categoryIconContainer}>
          <Ionicons
            name={CATEGEORY_ICONS[item.category] || "help-circle"}
            size={24}
            color={isIncome ? "green" : "red"}
          />
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text> 
          
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <Text 
            style={[styles.transactionAmount, 
              {color: isIncome ? "green" : "red"}
            ]}
          >
            ₹{parseFloat(item.amount).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => onDelete(item.id)}
      >
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};