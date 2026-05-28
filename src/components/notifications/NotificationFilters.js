import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function NotificationFilters({
  filters,
  activeFilter,
  onChangeFilter,
}) {
  return (
    <View style={styles.filters}>
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
    </View>
  );
}
const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    marginBottom: 24,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginRight: 10,

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
    backgroundColor: colors.black,
  },

  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.subtitle,
  },

  filterTextActive: {
    color: colors.textLight,
  },

  filterCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },

  filterCountActive: {
    backgroundColor: colors.primary,
  },

  filterCountText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.button,
  },

  filterCountTextActive: {
    color: colors.black,
  },
});