import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Typography, Paper, Box, Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const DocumentPage: React.FC = () => {
  const { collectionName, documentId } = useParams<{ collectionName?: string; documentId?: string }>(); // Use specific typing here
  const [documentData, setDocumentData] = useState<DocumentData | undefined>();

  useEffect(() => {
    if (!collectionName || !documentId) {
      console.error('Collection name or document ID is undefined.');
      return;
    }

    const fetchDocument = async () => {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDocumentData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchDocument();
  }, [collectionName, documentId]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {documentId?.replace(/_/g, ' ')}
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        {documentData ? (
          <Box>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              <LocationOnIcon color="primary" /> {documentData.location}
            </Typography>
            <Typography variant="body1" component="div">
              <strong>Address:</strong> {documentData.address}
            </Typography>
            <Typography variant="body1" component="div">
              <strong>Postal Code:</strong> {documentData.postal}
            </Typography>
            <Typography variant="body1" component="div">
              <strong>URL:</strong> <Link href={documentData.url} target="_blank" rel="noopener">{documentData.url}</Link>
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2">Loading document...</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DocumentPage;
