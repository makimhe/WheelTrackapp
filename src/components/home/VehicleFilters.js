import React from 'react';

import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function VehicleFilters({
  filters,
  activeFilter,
  onChangeFilter,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      style={styles.filters}
      contentContainerStyle={styles.filtersContent}
    >
      {filters.map((item) => {
        const isActive = activeFilter === item.key;

        return (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.filterButton,
              isActive && styles.filterButtonActive,
            ]}
            activeOpacity={0.85}
            onPress={() => onChangeFilter(item.key)}
          >
            <Text
              style={[
                styles.filterText,
                isActive && styles.filterTextActive,
              ]}
            >
              {item.label}
            </Text>

            <View
              style={[
                styles.filterCount,
                isActive && styles.filterCountActive,
              ]}
            >
              <Text
                style={[
                  styles.filterCountText,
                  isActive && styles.filterCountTextActive,
                ]}
              >
                {item.count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: {
    marginBottom: 22,
  },

  filtersContent: {
    flexDirection: 'row',
    paddingRight: 20,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 13,
    marginRight: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  filterButtonActive: {
    backgroundColor: '#111',
  },

  filterText: {
    fontSize: 12,
    color: '#777',
    fontFamily: fonts.subtitle,
  },

  filterTextActive: {
    color: '#FFF',
  },

  filterCount: {
    minWidth: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
    paddingHorizontal: 6,
  },

  filterCountActive: {
    backgroundColor: colors.primary,
  },

  filterCountText: {
    fontSize: 10,
    color: '#777',
    fontFamily: fonts.button,
  },

  filterCountTextActive: {
    color: '#FFF',
  },
});