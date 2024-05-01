import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Container, List, ListItem, ListItemText, Typography, Paper, CircularProgress } from '@mui/material';

interface Document {
  id: string;
  [key: string]: any;
}

const CollectionPage: React.FC = () => {
  const { collectionName } = useParams<{ collectionName?: string }>(); // Use specific typing here
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionName) {
      console.error('Collection name is undefined.');
      setLoading(false);
      return;
    }

    const fetchDocuments = async () => {
      const docCollection = collection(db, collectionName);
      const snapshot = await getDocs(docCollection);
      setDocuments(snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      })));
      setLoading(false);
    };

    fetchDocuments();
  }, [collectionName]);

  if (loading) return <p>Loading documents...</p>;

  return (
    <Container component={Paper} elevation={6} sx={{ mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {collectionName?.replace(/_/g, ' ')}
      </Typography>
      <List>
        {documents.map(doc => (
          <ListItem button component={Link} to={`/collection/${collectionName}/document/${doc.id}`} key={doc.id}>
            <ListItemText primary={doc.id.replace(/_/g, ' ')} secondary={JSON.stringify(doc)} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CollectionPage;
