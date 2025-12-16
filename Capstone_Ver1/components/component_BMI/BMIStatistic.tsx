import { chartStyles } from "../charts/chartStyle";
import  MiniBars  from "../charts/MiniBars";

import { View, Text } from "react-native";
import Stat from "../charts/Stat";


/* ========================= BMIStatistic Component ========================= */


export default function BMIStatistic({ max, min, avg, values, labels }: any) {
  return (
    <View style={chartStyles.card}>
      <View style={chartStyles.header}>
        <Text style={chartStyles.title}>BMI</Text>
      </View>
      <View style={chartStyles.statsRow}>
        <Stat label="Max" value={max} />
        <Stat label="Min" value={min} />
        <Stat label="Trung bình" value={avg} />
      </View>
      <MiniBars
        values={values}
        min={15}
        max={25}
        yTicks={[25, 23, 21, 19, 17, 15]}
        showYAxis={true}
        labels={labels}
        barColor="#86efac"
        dotColor="#22c55e"
      />
    </View>
  );
}
