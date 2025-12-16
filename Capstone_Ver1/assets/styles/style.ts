import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF4',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFDF4',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  weatherText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  deviceCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  deviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  deviceDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  deviceImageContainer: {
    height: 180,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
overflow: 'hidden',
    position: 'relative',
  },
  offlineBadgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  offlineBadgeText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
  expiredBadge: {
    position: 'absolute',
    top: 44,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
    marginRight: 6,
  },
  expiredText: {
    color: '#374151',
    fontSize: 12,
  },
  deviceActions: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  helpButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  helpButtonText: {
    color: '#111827',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100, 
  },
  featureCard: {
    width: '49%',
    height: 140,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    
  },
  cardContent: {
  flex: 1,
  justifyContent: 'flex-start', // chữ nằm trên
  alignItems: 'flex-start',     // chữ căn trái
},
tileIcon: {
  marginTop: -10,                 // khoảng cách từ chữ xuống icon
  alignSelf: 'flex-end',        // căn phải của FeatureCard
  opacity: 0.8,
},
cardTitleBold: {
  fontSize: 21,
  fontWeight: '700',
  color: '#414244ff',
},
  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  cardValueLarge: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563eb',
  },
  cardValueEmpty: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E',
  },
  cardValueCyan: {
    fontSize: 18,
    fontWeight: '800',
    color: '#06b6d4',
  },
  cardUnit: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  tileBlue: {
    backgroundColor: '#eef2ff',
  },
  tilePink: {
    backgroundColor: '#fdeaf0',
  },
  tileIndigo: {
    backgroundColor: '#f1effe',
  },
  tileCyan: {
    backgroundColor: '#e6f9fd',
  },
  tileTeal: {
    backgroundColor: '#e9fbf4',
  },
  tileOrange: {
    backgroundColor: '#fff2e8',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
paddingVertical: 8,
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
  warningButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#FF9800',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  warningIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningLines: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  warningLine: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  warningLineLeft: {
    top: 8,
    left: 4,
    transform: [{ rotate: '-20deg' }],
  },
  warningLineRight: {
    top: 8,
    right: 4,
    transform: [{ rotate: '20deg' }],
  },
  lifestyleIconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  plusIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
});

export default styles;