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
    backgroundColor: colors.surfaceSoft,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 13,
    marginRight: 8,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
  },

  filterText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.subtitle,
  },

  filterTextActive: {
    color: colors.textLight,
  },

  filterCount: {
    minWidth: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
    paddingHorizontal: 6,
  },

  filterCountActive: {
    backgroundColor: colors.white,
  },

  filterCountText: {
    fontSize: 10,
    color: colors.textLight,
    fontFamily: fonts.button,
  },

  filterCountTextActive: {
    color: colors.black,
  },
});