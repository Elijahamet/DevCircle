import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { useDevCircle } from '@/context/DevCircleContext';
import { CodeSnippet } from '@/types';

interface CodeBlockProps {
  snippet: CodeSnippet;
  maxLines?: number;
  showCopy?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  snippet,
  maxLines,
  showCopy = true,
}) => {
  const { colors } = useDevCircle();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = snippet.code.split('\n');
  const displayedLines = maxLines ? lines.slice(0, maxLines) : lines;
  const isTruncated = maxLines && lines.length > maxLines;

  return (
    <View style={styles.container}>
      {/* Code block terminal top bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
          <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
          <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.fileName}>
            {snippet.fileName || `snippet.${snippet.language}`}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.languageBadge}>
            <Text style={styles.languageText}>{snippet.language.toUpperCase()}</Text>
          </View>
          {showCopy && (
            <TouchableOpacity
              onPress={handleCopy}
              activeOpacity={0.7}
              style={styles.copyButton}>
              <Ionicons
                name={copied ? 'checkmark' : 'copy-outline'}
                size={14}
                color={copied ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.copyText,
                  copied && { color: colors.primary },
                ]}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Code body with line numbers */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.codeContainer}>
          {displayedLines.map((line, index) => (
            <View key={index} style={styles.lineRow}>
              <Text style={styles.lineNumber}>{index + 1}</Text>
              <Text style={styles.lineContent}>{line || ' '}</Text>
            </View>
          ))}
          {isTruncated && (
            <View style={styles.truncatedRow}>
              <Text style={styles.truncatedText}>
                ... {lines.length - maxLines} more lines
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A1422',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#1D2E45',
    overflow: 'hidden',
    marginVertical: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#112033',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1D2E45',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  fileName: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginLeft: 6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  languageBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  languageText: {
    fontSize: 10,
    color: '#38BDF8',
    fontWeight: '700',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#18273B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  copyText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  scrollContent: {
    padding: Spacing.md,
  },
  codeContainer: {
    flexDirection: 'column',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 1.5,
  },
  lineNumber: {
    width: 28,
    fontSize: 12,
    color: '#475569',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'right',
    marginRight: 12,
    userSelect: 'none',
  },
  lineContent: {
    fontSize: 12.5,
    color: '#E2E8F0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.2,
  },
  truncatedRow: {
    paddingLeft: 40,
    paddingTop: 4,
  },
  truncatedText: {
    fontSize: 12,
    color: '#19E68C',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontStyle: 'italic',
  },
});
