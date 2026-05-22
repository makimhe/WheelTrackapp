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
    backgroundColor: '#F8F8F8',
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginRight: 10,

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
    fontSize: 13,
    color: '#777',
    fontFamily: fonts.subtitle,
  },

  filterTextActive: {
    color: '#FFF',
  },

  filterCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ECECEC',
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
    color: '#777',
    fontFamily: fonts.button,
  },

  filterCountTextActive: {
    color: '#FFF',
  },
});